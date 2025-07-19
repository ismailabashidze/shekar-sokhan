# PocketBase Collection Schema: push_subscriptions

## Collection Name: `push_subscriptions`

### Fields:
1. **id** (auto-generated)
2. **userId** (relation to users collection)
   - Type: Relation
   - Collection: users
   - Required: Yes
3. **endpoint** (text)
   - Type: Text
   - Required: Yes
   - Max Length: 1000
4. **p256dh** (text)
   - Type: Text
   - Required: Yes
   - Max Length: 500
5. **auth** (text)
   - Type: Text
   - Required: Yes
   - Max Length: 500
6. **deviceInfo** (json)
   - Type: JSON
   - Required: No
7. **created** (auto-generated)
8. **updated** (auto-generated)

### API Rules:
- **List**: `@request.auth.id != "" && userId = @request.auth.id`
- **View**: `@request.auth.id != "" && userId = @request.auth.id`
- **Create**: `@request.auth.id != "" && userId = @request.auth.id`
- **Update**: `@request.auth.id != "" && userId = @request.auth.id`
- **Delete**: `@request.auth.id != "" && userId = @request.auth.id`

### Admin Rules:
- **List**: `@request.auth.role = "admin"`
- **View**: `@request.auth.role = "admin"`
- **Create**: `@request.auth.role = "admin"`
- **Update**: `@request.auth.role = "admin"`
- **Delete**: `@request.auth.role = "admin"`