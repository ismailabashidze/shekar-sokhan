routerAdd('POST', '/hello', (c) => {
  const data = $apis.requestInfo(c).data
  console.log(data.salam)
  return c.json(200, {
    message: 'hello',
  })
})
routerAdd('POST', '/generate-code', (c) => {
  const data = $apis.requestInfo(c).data
  const count = (data.count)
  const length = (data.length)
  const characters = 'abcdefghijklmnopqrstuvwxyz123456789'
  const finalCodes = []
  for (let i = 0; i < count; i++) {
    let result = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      result += characters[randomIndex]
    }
    finalCodes.push(data.prefix + result)
    const collection = $app.dao().findCollectionByNameOrId('discountCopoun')
    const record = new Record(collection, {
      amount: 1000,
      code: data.prefix + result,
      isUsed: false,
      duration: data.duration,
    })
    $app.dao().saveRecord(record)
  }
  return c.json(200, {
    message: finalCodes,
  })
})
// verify the user by phone and sms
routerAdd(
  'GET',
  '/verifyBySms/:phoneNumber',
  (c) => {
    const phoneNumber = c.pathParam('phoneNumber')
    const u = $app
      .dao()
      .findFirstRecordByData('users', 'phoneNumber', phoneNumber)
    console.log('u')
    console.log(u)
    const res = $http.send({
      url: `https://api.kavenegar.com/v1/434A544C4C3667303161387A52525049573471444C346C6734617A386F465763/verify/lookup.json?receptor=${phoneNumber}&token=${u.get(
            'verifyCode',
          )}&template=verify-fa`,
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      timeout: 120,
    })
    return c.json(200, {
      message: 'code sent to this phone: ' + u.get('phoneNumber'),
    })
  },
  $apis.activityLogger($app),
)

// verify the user by phone and sms
routerAdd(
  'GET',
  '/verifyBySms/:phoneNumber/:code',
  (c) => {
    const phoneNumber = c.pathParam('phoneNumber')
    const code = c.pathParam('code')
    const u = $app
      .dao()
      .findFirstRecordByData('users', 'phoneNumber', phoneNumber)
    if (u.get('verifyCode') == code) {
      u.set('verified', true)
      u.set('status', 'evaluation')
      $app.dao().saveRecord(u)
      return c.json(200, {
        message: 'user verfied: ' + u.get('id'),
      })
    }
    else {
      throw new BadRequestError('codes does not match')
    }
  },
  $apis.activityLogger($app),
)

// if sender is user, then its message will send due to a service on the port 5000
// and then we have to store the incomming message from agent to the database.
// onModelAfterCreate((e) => {
//   const message = e.model.get("message");
//   if (e.model.get("sender") === "user") {
//     const agent = $app.dao().findRecordById("agents", e.model.get("agent_id"));
//     const character_id = agent.get("character_id");
//     console.log(character_id);
//     const res = $http.send({
//       url: "http://127.0.0.1:5000/chat/" + character_id,
//       method: "POST",
//       body: JSON.stringify({
//         message,
//       }),
//       headers: { "content-type": "application/json" },
//       timeout: 120,
//     });
//     if (res.statusCode === 200) {
//       const collection = $app.dao().findCollectionByNameOrId("messages");
//       const record = new Record(collection, {
//         session_id: e.model.get("session_id"),
//         user_id: e.model.get("user_id"),
//         agent_id: e.model.get("agent_id"),
//         time_sent: new Date(),
//         sender: "agent",
//         message: res.json.response,
//       });
//       $app.dao().saveRecord(record);
//     }
//   }
// }, "messages");

// New Users should be forced to not paid
// also, a new payment with status pending will create for them

onRecordBeforeCreateRequest((e) => {
  const discountCopoun = $app
    .dao()
    .findRecordsByFilter(
      'charge',
      'user = {:user} && isDone = false',
      '+created',
      10,
      0,
      { user: e.record.get('user') },
    )
  if (e.record.get('role') === 'user') {
    console.log(discountCopoun[0].get('isDone'))
    console.log(JSON.stringify(discountCopoun, null, 2))
    if (
      discountCopoun[0].get('isDone')
      || discountCopoun[0].get('isOutdated')
    ) {
      throw new BadRequestError('You have to charge account')
    }
    else {
      const prev = discountCopoun[0].get('used')
      discountCopoun[0].set('used', prev + 1)
      if (prev + 1 == discountCopoun[0].get('totalCharge') / 1000) {
        discountCopoun[0].set('isDone', true)
        const u = $app
          .dao()
          .findRecordById('users', discountCopoun[0].get('user'))
        u.set('hasCharge', false)
        $app.dao().saveRecord(u)

        // Update all in-progress sessions to done
        const inProgressSessions = $app
          .dao()
          .findRecordsByFilter(
            'sessions',
            'user = {:user} && status = "inprogress"',
            '+created',
            1000,
            0,
            { user: discountCopoun[0].get('user') },
          )
        inProgressSessions.forEach((session) => {
          // Create a placeholder analysis if needed
          let analysisId = session.get('session_analysis_for_system')
          if (!analysisId) {
            try {
              const analysisCollection = $app.dao().findCollectionByNameOrId('session_analysis')
              const placeholderAnalysis = new Record(analysisCollection, {
                session: session.id,
                title: 'جلسه پایان یافته به دلیل اتمام شارژ',
                summaryOfSession: 'این جلسه به دلیل اتمام شارژ کاربر به صورت خودکار پایان یافته است.',
                headlines: [],
                finalTrustAndOppennessOfUser: 'low',
                finalTrustAndOppennessOfUserEvaluationDescription: '',
                psychotherapistEvaluation: '',
                negativeScoresList: [],
                psychotherapistEvaluationScorePositiveBehavior: [],
                psychotherapistEvaluationScoreSuggestionsToImprove: [],
              })
              const savedAnalysis = $app.dao().saveRecord(placeholderAnalysis)
              analysisId = savedAnalysis.id
            }
            catch (analysisError) {
              console.error('Error creating placeholder analysis:', analysisError)
              // Continue even if analysis creation fails
            }
          }

          // Get message count
          const messagesResult = $app
            .dao()
            .findRecordsByFilter(
              'messages',
              'session_id = {:sessionId}',
              '+created',
              1000,
              0,
              { sessionId: session.id },
            )
          const messageCount = messagesResult.length || 0

          // Calculate session duration
          const startTime = new Date(session.get('start_time') || session.get('created'))
          const endTime = new Date()
          const totalTimePassedMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

          // Update all required fields
          session.set('status', 'done')
          session.set('end_time', endTime.toISOString())
          session.set('count_of_total_messages', messageCount)
          session.set('total_time_passed', totalTimePassedMinutes)
          if (analysisId) {
            session.set('session_analysis_for_system', analysisId)
          }

          $app.dao().saveRecord(session)
        })
      }
    }
    $app.dao().saveRecord(discountCopoun[0])
  }
}, 'messages')

routerAdd(
  'POST',
  '/redeemDiscount',
  (c) => {
    const { code, userId } = $apis.requestInfo(c).data
    const discountCopoun = $app
      .dao()
      .findFirstRecordByData('discountCopoun', 'code', code)
    if (!discountCopoun) {
      throw new BadRequestError('Discount code is invalid or not found.')
    }

    if (discountCopoun.get('isUsed')) {
      throw new BadRequestError('Discount code has already been used.')
    }

    discountCopoun.set('isUsed', true)
    $app.dao().saveRecord(discountCopoun)

    const collection = $app.dao().findCollectionByNameOrId('charge')
    const newCharge = new Record(collection, {
      user: userId,
      totalCharge: discountCopoun.get('amount'),
      used: 0,
      duration: Number(discountCopoun.get('duration')),
      isDone: false,
      isOutDated: false,
    })
    $app.dao().saveRecord(newCharge)
    try {
      const u = $app.dao().findRecordById('users', userId)
      u.set('hasCharge', true)
      let expireTime = new Date()
      const minutes = Number(discountCopoun.get('duration'))
      expireTime = new Date(expireTime.getTime() + minutes * 60000)
      u.set('expireChargeTime', expireTime)
      u.set('startChargeTime', new Date())
      $app.dao().saveRecord(u)
    }
    catch (e) {
      console.log(e)
    }
    return c.json(200, {
      message: 'Discount successfully redeemed.',
      chargeId: newCharge.get('id'),
    })
  },
  $apis.activityLogger($app),
)
cronAdd('removeCharges', '*/1 * * * *', () => {
  console.log('Running the charge check job...')
  const records = $app
    .dao()
    .findRecordsByFilter('charge', 'isDone = false', '+created', 10000, 0, {})
  records.forEach(async (record) => {
    const created = record.get('created')
    const parts = created.string().split(/[- :.Z]/)
    const dateCreated = Date.UTC(
      parts[0],
      Number(parts[1]) - 1,
      parts[2],
      parts[3],
      parts[4],
      parts[5],
      parts[6],
    )
    const duration = Number(record.get('duration'))
    const n = new Date()
    const n2 = n.getTime()
    const test = n2 - dateCreated
    const test2 = test / 60000
    if (test2 > duration) {
      record.set('isDone', true)
      record.set('isOutdated', true)
      $app.dao().saveRecord(record)
      console.log(
        `Updated record ${record.id}: isOutdated and isDone set to true.`,
      )
      const u = $app.dao().findRecordById('users', record.get('user'))
      u.set('hasCharge', false)
      $app.dao().saveRecord(u)

      // Update all in-progress sessions to done
      const inProgressSessions = $app
        .dao()
        .findRecordsByFilter(
          'sessions',
          'user = {:user} && status = "inprogress"',
          '+created',
          1000,
          0,
          { user: record.get('user') },
        )
      inProgressSessions.forEach((session) => {
        // Create a placeholder analysis if needed
        let analysisId = session.get('session_analysis_for_system')
        if (!analysisId) {
          try {
            const analysisCollection = $app.dao().findCollectionByNameOrId('session_analysis')
            const placeholderAnalysis = new Record(analysisCollection, {
              session: session.id,
              title: 'جلسه پایان یافته به دلیل اتمام شارژ',
              summaryOfSession: 'این جلسه به دلیل اتمام شارژ کاربر به صورت خودکار پایان یافته است.',
              headlines: [],
              finalTrustAndOppennessOfUser: 'low',
              finalTrustAndOppennessOfUserEvaluationDescription: '',
              psychotherapistEvaluation: '',
              negativeScoresList: [],
              psychotherapistEvaluationScorePositiveBehavior: [],
              psychotherapistEvaluationScoreSuggestionsToImprove: [],
            })
            const savedAnalysis = $app.dao().saveRecord(placeholderAnalysis)
            analysisId = savedAnalysis.id
          }
          catch (analysisError) {
            console.error('Error creating placeholder analysis:', analysisError)
            // Continue even if analysis creation fails
          }
        }

        // Get message count
        const messagesResult = $app
          .dao()
          .findRecordsByFilter(
            'messages',
            'session_id = {:sessionId}',
            '+created',
            1000,
            0,
            { sessionId: session.id },
          )
        const messageCount = messagesResult.length || 0

        // Calculate session duration
        const startTime = new Date(session.get('start_time') || session.get('created'))
        const endTime = new Date()
        const totalTimePassedMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

        // Update all required fields
        session.set('status', 'done')
        session.set('end_time', endTime.toISOString())
        session.set('count_of_total_messages', messageCount)
        session.set('total_time_passed', totalTimePassedMinutes)
        if (analysisId) {
          session.set('session_analysis_for_system', analysisId)
        }

        $app.dao().saveRecord(session)
      })
    }
  })
})
routerAdd('POST', '/deleteAllMessages', (c) => {
  const data = $apis.requestInfo(c).data
  const userId = data.userId
  const u = $app.dao().findRecordById('users', userId)
  u.set('currentDeletionDivider', Number(u.get('currentDeletionDivider') + 1))
  $app.dao().saveRecord(u)
  return c.json(200, {
    message: 'success',
  })
})

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
    const currentCount = parseInt(dashboardData.get('count_of_sessions') || 0, 10)
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
  console.log(newStatus)

  const oldStatus = e.model.originalData?.status
  console.log(oldStatus)

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
      console.log('e.model.get(\'total_time_passed\')', totalTimePassed)
      const currentTimeOfUsage = parseInt(dashboardData.get('time_of_usage') || 0, 10)

      // Update the time of usage
      dashboardData.set('time_of_usage', currentTimeOfUsage + totalTimePassed)

      // Update message count if available
      const messageCount = e.model.get('count_of_total_messages') || 0
      const currentMessageCount = parseInt(dashboardData.get('count_of_messages') || 0, 10)
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
    const currentCount = parseInt(dashboardData.get('count_of_users') || 0, 10)
    dashboardData.set('count_of_users', currentCount + 1)

    // Save the updated record
    $app.dao().saveRecord(dashboardData)

    console.log('User statistics updated successfully')
  }
  catch (error) {
    console.error('Error updating user statistics:', error)
  }
}, 'users')

/**
 * Cron job for inactive sessions management
 * Runs daily at midnight
 */
cronAdd('manageInactiveSessions', '0 0 * * *', () => {
  console.log('Running the daily inactive sessions management job...')

  // Get yesterday's date (24 hours ago)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  // Find all inprogress sessions from yesterday or earlier
  const inProgressSessions = $app
    .dao()
    .findRecordsByFilter(
      'sessions',
      'status = "inprogress" && created <= {:yesterday}',
      '+created',
      10000, 0,
      { yesterday: yesterday.toISOString() },
    )

  console.log(`Found ${inProgressSessions.length} inactive sessions to process`)

  let closedCount = 0
  let deletedCount = 0

  inProgressSessions.forEach((session) => {
    const startTime = new Date(session.get('start_time') || session.get('created'))
    const currentTime = new Date()
    const hoursDifference = (currentTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

    // Get message count and time passed
    const messageCount = session.get('count_of_total_messages') || 0
    const timePassed = session.get('total_time_passed') || 0

    // Set end time to current time
    session.set('end_time', currentTime.toISOString())

    // Case 1: Empty session (no messages, no time)
    if (messageCount === 0 && timePassed === 0) {
      session.set('status', 'deleted')
      deletedCount++
      console.log(`Session ${session.id} marked as deleted (empty session)`)
    }
    // Case 2: Session open for more than 3 hours OR from yesterday with messages
    else if ((hoursDifference > 3 || hoursDifference >= 24) && messageCount > 0) {
      session.set('status', 'closed')

      // Calculate and update total time if not already set
      if (timePassed === 0) {
        const minutesDifference = Math.round(hoursDifference * 60)
        session.set('total_time_passed', minutesDifference)
      }

      // If message count is not set, try to count messages
      if (messageCount === 0) {
        try {
          const messagesResult = $app
            .dao()
            .findRecordsByFilter(
              'messages',
              'session_id = {:sessionId}',
              '+created',
              1000, 0,
              { sessionId: session.id },
            )
          session.set('count_of_total_messages', messagesResult.length)
        }
        catch (error) {
          console.error(`Error counting messages for session ${session.id}:`, error)
        }
      }

      closedCount++
      console.log(`Session ${session.id} marked as closed (inactive for > 3 hours)`)
    }

    // Save the updated session
    $app.dao().saveRecord(session)
  })

  // Update dashboard statistics
  try {
    let dashboardData = $app
      .dao()
      .findFirstRecordByData('dashboard_data', 'id', 'dashboard-12345')

    if (dashboardData) {
      // Update closed count
      const currentClosedCount = parseInt(dashboardData.get('count_of_closed') || 0, 10)
      dashboardData.set('count_of_closed', currentClosedCount + closedCount)

      // Update deleted count
      const currentDeletedCount = parseInt(dashboardData.get('count_of_deleted') || 0, 10)
      dashboardData.set('count_of_deleted', currentDeletedCount + deletedCount)

      // Save the updated record
      $app.dao().saveRecord(dashboardData)
      console.log(`Dashboard statistics updated: ${closedCount} closed, ${deletedCount} deleted`)
    }
    else {
      console.error('Dashboard data record not found')
    }
  }
  catch (error) {
    console.error('Error updating dashboard statistics:', error)
  }
})

/**
 * Custom endpoint to manage inactive sessions
 *
 * Allows manual triggering of the session cleanup process
 * Optional query parameter "days" to specify how many days back to check
 * Default is 1 day (yesterday)
 */
routerAdd('GET', '/api/manage-inactive-sessions', (c) => {
  console.log('API endpoint: manage-inactive-sessions triggered')

  // Get days parameter from query with default of 1
  const daysBack = parseInt(c.queryParam('days') || '1', 10)

  // Validate input
  if (isNaN(daysBack) || daysBack < 1 || daysBack > 30) {
    return c.json(400, {
      success: false,
      message: 'Invalid days parameter. Must be between 1 and 30.',
    })
  }

  try {
    // Get date from N days ago
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() - daysBack)

    console.log(`Looking for sessions older than ${targetDate.toISOString()}`)

    // Find all inprogress sessions from target date or earlier
    const inProgressSessions = $app
      .dao()
      .findRecordsByFilter(
        'sessions',
        'status = "inprogress" && created <= {:targetDate}',
        '+created',
        10000, 0,
        { targetDate: targetDate.toISOString() },
      )

    console.log(`Found ${inProgressSessions.length} inactive sessions to process`)

    let closedCount = 0
    let deletedCount = 0

    inProgressSessions.forEach((session) => {
      const startTime = new Date(session.get('start_time') || session.get('created'))
      const currentTime = new Date()
      const hoursDifference = (currentTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

      // Get message count and time passed
      const messageCount = session.get('count_of_total_messages') || 0
      const timePassed = session.get('total_time_passed') || 0

      // Set end time to current time
      session.set('end_time', currentTime.toISOString())

      // Case 1: Empty session (no messages, no time)
      if (messageCount === 0 && timePassed === 0) {
        session.set('status', 'deleted')
        deletedCount++
        console.log(`Session ${session.id} marked as deleted (empty session)`)
      }
      // Case 2: Session open for more than 3 hours OR from yesterday with messages
      else if ((hoursDifference > 3 || hoursDifference >= 24) && messageCount > 0) {
        session.set('status', 'closed')

        // Calculate and update total time if not already set
        if (timePassed === 0) {
          const minutesDifference = Math.round(hoursDifference * 60)
          session.set('total_time_passed', minutesDifference)
        }

        // If message count is not set, try to count messages
        if (messageCount === 0) {
          try {
            const messagesResult = $app
              .dao()
              .findRecordsByFilter(
                'messages',
                'session_id = {:sessionId}',
                '+created',
                1000, 0,
                { sessionId: session.id },
              )
            session.set('count_of_total_messages', messagesResult.length)
          }
          catch (error) {
            console.error(`Error counting messages for session ${session.id}:`, error)
          }
        }

        closedCount++
        console.log(`Session ${session.id} marked as closed (inactive for > 3 hours)`)
      }

      // Save the updated session
      $app.dao().saveRecord(session)
    })

    // Update dashboard statistics
    try {
      let dashboardData = $app
        .dao()
        .findFirstRecordByData('dashboard_data', 'id', 'dashboard-12345')

      if (dashboardData) {
        // Update closed count
        const currentClosedCount = parseInt(dashboardData.get('count_of_closed') || 0, 10)
        dashboardData.set('count_of_closed', currentClosedCount + closedCount)

        // Update deleted count
        const currentDeletedCount = parseInt(dashboardData.get('count_of_deleted') || 0, 10)
        dashboardData.set('count_of_deleted', currentDeletedCount + deletedCount)

        // Save the updated record
        $app.dao().saveRecord(dashboardData)
        console.log(`Dashboard statistics updated: ${closedCount} closed, ${deletedCount} deleted`)
      }
      else {
        console.error('Dashboard data record not found')
      }
    }
    catch (error) {
      console.error('Error updating dashboard statistics:', error)
    }

    // Return success with statistics
    return c.json(200, {
      success: true,
      message: `Successfully processed inactive sessions from the past ${daysBack} days`,
      statistics: {
        closedSessions: closedCount,
        deletedSessions: deletedCount,
        totalProcessed: closedCount + deletedCount,
      },
    })
  }
  catch (error) {
    console.error('Error in manage-inactive-sessions endpoint:', error)
    return c.json(500, {
      success: false,
      message: 'An error occurred while processing inactive sessions',
      error: error.message,
    })
  }
}, $apis.activityLogger($app))

// Start a payment, register with Dargah, create payment record
routerAdd('POST', '/startPayment', async (c) => {
  const { userId, amount, duration } = $apis.requestInfo(c).data
  const factor_number = 'F-' + Date.now() + '-' + Math.floor(Math.random() * 10000)
  // 1. Get valid Dargah token
  try {
    let settings = $app.dao().findFirstRecordByData('settings', 'key', 'dargah_token')
    if (settings && settings.get('expires_at') > Date.now()) {
      const dargahRes = $http.send({
        url: 'https://dargahno.net/api/v2/transaction/register',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JSON.stringify(settings.get('token')).slice(1, JSON.stringify(settings.get('token')).length - 1)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchent_id: 'e07ef02a-4723-4355-9006-88bbbabf8918',
          price: amount,
          factor_number,
          callback_url: 'https://zehna.ir/onboarding/payment-callback',
        }),
      })
      console.log('dargahRes')
      console.log(JSON.stringify(dargahRes))
    }
    else {
      throw ('time is passed, generate a new code')
    }
  }
  catch (e) {
    // Otherwise, login and get new token (use env or settings for credentials)
    const password = '0210511373'
    const username = '09121248393'
    const grant_type = 'password'

    // Construct the body as a URL-encoded string
    const formBody = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&grant_type=${encodeURIComponent(grant_type)}`

    console.log('Attempting to send this form data to /api/v2/auth/login:', formBody)

    const loginRes = $http.send({
      url: 'https://dargahno.net/api/v2/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
      timeout: 10000,
    })

    if (loginRes.statusCode === 200 && loginRes.json.access_token) {
      const settingsCol = $app.dao().findCollectionByNameOrId('settings')
      console.log(JSON.stringify({
        key: 'dargah_token',
        token: loginRes.json.access_token,
        expires_at: Date.now() + (loginRes.json.expire_time || 30) * 1000 * 60,
      }))
      const settings = new Record(settingsCol, {
        key: 'dargah_token',
        token: loginRes.json.access_token,
        expires_at: Date.now() + (loginRes.json.expire_time || 30) * 1000 * 60,
      })

      $app.dao().saveRecord(settings)
      token = loginRes.json.access_token
      const dargahRes = $http.send({
        url: 'https://dargahno.net/api/v2/transaction/register',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchent_id: 'e07ef02a-4723-4355-9006-88bbbabf8918',
          price: amount,
          factor_number: factor_number,
          callback_url: 'https://zehna.ir/onboarding/payment-callback',
        }),
      })
      console.log('dargahRes')
      console.log(JSON.stringify(dargahRes))
    }
    else {
      throw new BadRequestError('Could not authenticate with Dargah: ' + (loginRes.json.detail || 'Unknown error'))
    }
  }

  const { authority } = dargahRes.json
  // 2. Create payment record
  const paymentCol = $app.dao().findCollectionByNameOrId('payment')

  console.log(JSON.stringify({
    user: userId,
    amount,
    factor_number,
    authority,
    status: 'pending',
    gateway_response: dargahRes.json,
  }))
  const payment = new Record(paymentCol, {
    user: userId,
    amount,
    factor_number,
    authority,
    status: 'pending',
    gateway_response: dargahRes.json,
  })
  $app.dao().saveRecord(payment)
  // 3. Return payment URL
  return c.json(200, {
    paymentUrl: `https://pay.dargahno.net/?authority=${authority}`,
  })
})

// Verify payment after callback, update payment and grant charge
routerAdd('POST', '/verifyPayment', async (c) => {
  const { authority } = $apis.requestInfo(c).data
  // 1. Find payment record
  const payment = $app.dao().findFirstRecordByData('payment', 'authority', authority)
  if (!payment) throw new BadRequestError('Payment not found')
  // 2. Get valid Dargah token
  let token = null
  let settings = $app.dao().findFirstRecordByData('settings', 'key', 'dargah_token')
  if (settings && settings.get('token') && settings.get('expires_at') > Date.now()) {
    return settings.get('token')
  }
  // Otherwise, login and get new token (use env or settings for credentials)
  const merchent_id = 'e07ef02a-4723-4355-9006-88bbbabf8918' // TODO: replace with real value or fetch from settings
  const password = '0210511373' // TODO: replace with real value or fetch from settings
  const loginRes = $http.send({
    url: 'https://dargahno.net/api/v2/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merchent_id, password }),
  })
  if (loginRes.statusCode === 200 && loginRes.json.access_token) {
    if (!settings) {
      const settingsCol = $app.dao().findCollectionByNameOrId('settings')
      settings = new Record(settingsCol, {
        key: 'dargah_token',
        token: loginRes.json.access_token,
        expires_at: Date.now() + (loginRes.json.expires_in || 3600) * 1000,
      })
    }
    else {
      settings.set('token', loginRes.json.access_token)
      settings.set('expires_at', Date.now() + (loginRes.json.expires_in || 3600) * 1000)
    }
    $app.dao().saveRecord(settings)
    token = loginRes.json.access_token
  }
  else {
    throw new BadRequestError('Could not authenticate with Dargah: ' + (loginRes.json.detail || 'Unknown error'))
  }

  // 3. Call Dargah /check
  const checkRes = $http.send({
    url: 'https://dargahno.net/api/v2/transaction/check',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      authority,
      new_price: payment.get('amount').toString(),
    }),
  })
  const result = checkRes.json
  // 3. Update payment status
  if (result.status === 100) {
    payment.set('status', 'paid')
    payment.set('ref_id', result.ref_id)
    payment.set('gateway_response', result)
    $app.dao().saveRecord(payment)
    // 4. Grant charge if not already granted
    const chargeCol = $app.dao().findCollectionByNameOrId('charge')
    // Check if charge already exists for this payment
    const existingCharge = $app.dao().findRecordsByFilter(
      'charge',
      'payment = {:payment}',
      '+created',
      1, 0,
      { payment: payment.id },
    )
    if (!existingCharge.length) {
      const charge = new Record(chargeCol, {
        user: payment.get('user'),
        totalCharge: payment.get('amount'),
        used: 0,
        duration: duration || 60, // fallback duration
        isDone: false,
        isOutdated: false,
        payment: payment.id,
      })
      $app.dao().saveRecord(charge)
    }
  }
  else {
    payment.set('status', 'failed')
    payment.set('gateway_response', result)
    $app.dao().saveRecord(payment)
  }
  return c.json(200, { status: result.status, msg: result.msg })
})
