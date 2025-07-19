// pb_hooks/notifications_subscribe.pb.js
routerAdd("POST", "/api/notifications/subscribe", (c) => {
    const data = c.bind({})
    
    if (!data.subscription || !data.userId) {
      return c.json(400, {"error": "Missing subscription or userId"})
    }

    const subscription = data.subscription
    const userId = data.userId
    const deviceInfo = data.deviceInfo || {}

    if (!subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
      return c.json(400, {"error": "Invalid subscription format"})
    }

    try {
      // Check if subscription already exists
      const existingRecord = $app.dao().findFirstRecordByFilter(
        "push_subscriptions",
        `userId = "${userId}" && endpoint = "${subscription.endpoint}"`
      )

      if (existingRecord) {
        // Update existing subscription
        existingRecord.set("p256dh", subscription.keys.p256dh)
        existingRecord.set("auth", subscription.keys.auth)
        existingRecord.set("deviceInfo", deviceInfo)
        $app.dao().saveRecord(existingRecord)
        
        return c.json(200, {
          "success": true,
          "message": "Subscription updated successfully",
          "id": existingRecord.id
        })
      } else {
        // Create new subscription
        const collection = $app.dao().findCollectionByNameOrId("push_subscriptions")
        const record = new Record(collection, {
          "userId": userId,
          "endpoint": subscription.endpoint,
          "p256dh": subscription.keys.p256dh,
          "auth": subscription.keys.auth,
          "deviceInfo": deviceInfo
        })
        
        $app.dao().saveRecord(record)
        
        return c.json(200, {
          "success": true,
          "message": "Subscription created successfully",
          "id": record.id
        })
      }
    } catch (err) {
      console.error("Error saving push subscription:", err)
      return c.json(500, {"error": "Failed to save subscription"})
    }
})