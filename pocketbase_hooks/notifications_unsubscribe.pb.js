// pb_hooks/notifications_unsubscribe.pb.js
routerAdd("POST", "/api/notifications/unsubscribe", (c) => {
    const data = c.bind({})
    
    if (!data.endpoint || !data.userId) {
      return c.json(400, {"error": "Missing endpoint or userId"})
    }

    const endpoint = data.endpoint
    const userId = data.userId

    try {
      // Find and delete the subscription
      const record = $app.dao().findFirstRecordByFilter(
        "push_subscriptions",
        `userId = "${userId}" && endpoint = "${endpoint}"`
      )

      if (record) {
        $app.dao().deleteRecord(record)
        
        return c.json(200, {
          "success": true,
          "message": "Subscription removed successfully"
        })
      } else {
        return c.json(404, {
          "success": false,
          "message": "Subscription not found"
        })
      }
    } catch (err) {
      console.error("Error removing push subscription:", err)
      return c.json(500, {"error": "Failed to remove subscription"})
    }
})