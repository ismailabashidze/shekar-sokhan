/**
 * Session Statistics Hooks
 *
 * This file contains hooks for tracking session statistics in the dashboard_data collection
 */

// After a new session is created, update dashboard statistics
onModelAfterCreate((e) => {
  // Only process sessions collection
  if (e.model.tableName() !== 'sessions') {
    return
  }

  console.log('Session created, updating dashboard statistics...')

  try {
    // Get or create the dashboard_data record
    let dashboardData = $app
      .dao()
      .findFirstRecordByData('dashboard_data', 'id', 'dashboard-12345')

    if (!dashboardData) {
      const collection = $app.dao().findCollectionByNameOrId('dashboard_data')
      dashboardData = new Record(collection, {
        id: 'dashboard-12345',
        time_of_usage: 0,
        count_of_messages: 0,
        count_of_users: 0,
        count_of_sessions: 0,
      })
    }

    // Increment the count of sessions
    const currentCount = dashboardData.get('count_of_sessions') || 0
    dashboardData.set('count_of_sessions', currentCount + 1)

    // Save the updated record
    $app.dao().saveRecord(dashboardData)

    console.log('Dashboard statistics updated successfully')
  }
  catch (error) {
    console.error('Error updating dashboard statistics:', error)
  }
}, 'sessions')

// After a session is updated, update time statistics
onModelAfterUpdate((e) => {
  // Only process sessions collection
  if (e.model.tableName() !== 'sessions') {
    return
  }

  // Only process if status changed to "done" or "closed"
  const newStatus = e.model.get('status')
  const oldStatus = e.model.oldGet('status')

  if ((newStatus === 'done' || newStatus === 'closed') && oldStatus === 'inprogress') {
    console.log('Session completed, updating time statistics...')

    try {
      // Get the dashboard_data record
      let dashboardData = $app
        .dao()
        .findFirstRecordByData('dashboard_data', 'id', 'dashboard-12345')

      if (!dashboardData) {
        console.log('Dashboard data not found, creating new record')
        const collection = $app.dao().findCollectionByNameOrId('dashboard_data')
        dashboardData = new Record(collection, {
          id: 'dashboard-12345',
          time_of_usage: 0,
          count_of_messages: 0,
          count_of_users: 0,
          count_of_sessions: 0,
        })
      }

      // Get the total time passed from the session
      const totalTimePassed = e.model.get('total_time_passed') || 0
      const currentTimeOfUsage = dashboardData.get('time_of_usage') || 0

      // Update the time of usage
      dashboardData.set('time_of_usage', currentTimeOfUsage + totalTimePassed)

      // Update message count if available
      const messageCount = e.model.get('count_of_total_messages') || 0
      const currentMessageCount = dashboardData.get('count_of_messages') || 0
      dashboardData.set('count_of_messages', currentMessageCount + messageCount)

      // Save the updated record
      $app.dao().saveRecord(dashboardData)

      console.log('Time and message statistics updated successfully')
    }
    catch (error) {
      console.error('Error updating time statistics:', error)
    }
  }
}, 'sessions')

// Track unique users when a new user is created
onModelAfterCreate((e) => {
  // Only process users collection
  if (e.model.tableName() !== 'users') {
    return
  }

  console.log('New user created, updating user statistics...')

  try {
    // Get the dashboard_data record
    let dashboardData = $app
      .dao()
      .findFirstRecordByData('dashboard_data', 'id', 'dashboard-12345')

    if (!dashboardData) {
      const collection = $app.dao().findCollectionByNameOrId('dashboard_data')
      dashboardData = new Record(collection, {
        id: 'dashboard-12345',
        time_of_usage: 0,
        count_of_messages: 0,
        count_of_users: 0,
        count_of_sessions: 0,
      })
    }

    // Increment the count of unique users
    const currentCount = dashboardData.get('count_of_users') || 0
    dashboardData.set('count_of_users', currentCount + 1)

    // Save the updated record
    $app.dao().saveRecord(dashboardData)

    console.log('User statistics updated successfully')
  }
  catch (error) {
    console.error('Error updating user statistics:', error)
  }
}, 'users')
