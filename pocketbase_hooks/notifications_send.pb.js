// pb_hooks/notifications_send.pb.js
routerAdd("POST", "/api/notifications/send", (c) => {
    const data = c.bind({})
    
    if (!data.userId && !data.recipientIds) {
      return c.json(400, {"error": "Missing userId or recipientIds"})
    }

    let recipients = []
    if (data.userId) {
      recipients = [data.userId]
    } else if (data.recipientIds) {
      recipients = data.recipientIds
    }

    const title = data.title || data.notification?.title
    const body = data.body || data.notification?.body
    const notificationData = data.data || data.notification?.data || {}
    const type = data.type || data.notification?.type || "info"

    if (!title || !body) {
      return c.json(400, {"error": "Missing title or body"})
    }

    try {
      let successCount = 0
      let errorCount = 0
      const errors = []

      recipients.forEach(userId => {
        try {
          // Save notification to database
          const notificationCollection = $app.dao().findCollectionByNameOrId("notifications")
          const notificationRecord = new Record(notificationCollection, {
            "user": userId,
            "title": title,
            "body": body,
            "data": notificationData,
            "type": type,
            "sent_via": "ntfy"
          })
          $app.dao().saveRecord(notificationRecord)

          // Send via ntfy.sh
          const ntfyTopic = `zehna-user-${userId}` // Unique topic per user
          const ntfyUrl = `https://ntfy.sh/${ntfyTopic}`
          
          const ntfyPayload = {
            "title": title,
            "message": body,
            "tags": [type === "crisis" ? "rotating_light" : "bell"],
            "priority": type === "crisis" ? 5 : 3,
            "actions": [
              {
                "action": "view",
                "label": "مشاهده",
                "url": notificationData.url || "https://app.zehna.ir"
              }
            ]
          }

          // Send HTTP request to ntfy.sh
          const response = $http.send({
            "url": ntfyUrl,
            "method": "POST",
            "headers": {
              "Content-Type": "application/json"
            },
            "body": JSON.stringify(ntfyPayload)
          })

          if (response.statusCode === 200) {
            successCount++
          } else {
            errorCount++
            errors.push(`User ${userId}: HTTP ${response.statusCode}`)
          }
        } catch (err) {
          errorCount++
          errors.push(`User ${userId}: ${err.message}`)
          console.error(`Error sending notification to user ${userId}:`, err)
        }
      })

      return c.json(200, {
        "success": true,
        "sent": successCount,
        "failed": errorCount,
        "total": recipients.length,
        "errors": errors
      })
    } catch (err) {
      console.error("Error sending notifications:", err)
      return c.json(500, {"error": "Failed to send notifications"})
    }
})