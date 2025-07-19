// pb_hooks/notifications_vapid.pb.js
routerAdd("GET", "/api/notifications/vapid-key", (c) => {
    // In production, store these keys securely in environment variables
    // For now, using hardcoded keys (you should generate new ones)
    const vapidKeys = {
      publicKey: "BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9fPNNw6V2SCQvJbLexhqNUe3Z9B3PbQNABJBp4QFG4xZA2EKKhHM",
      privateKey: "aUDcJ1WZvTCaZJxJXGWgHuJxLwkJiNvSs0LqJFJxO8Q"
    }
    
    return c.json(200, {
      "success": true,
      "publicKey": vapidKeys.publicKey
    })
})