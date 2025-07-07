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

// Payment verification endpoint
routerAdd('POST', '/verifyPayment', (c) => {
  const data = $apis.requestInfo(c).data
  const { authority, paymentId } = data

  if (!authority) {
    throw new BadRequestError('Authority is required')
  }

  try {
    // Verify payment with Dargah gateway
    const verifyResponse = $http.send({
      url: 'https://dargahno.net/api/v2/transaction/check',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ authority }),
      timeout: 30,
    })

    if (verifyResponse.statusCode !== 200) {
      throw new BadRequestError('Payment verification failed')
    }

    const verifyData = verifyResponse.json

    // Check if payment was successful (status 100 means success in Iranian gateways)
    if (verifyData.status === 100) {
      // Find and update payment record
      try {
        let payment = null

        // Try to find payment by paymentId first, then by authority
        if (paymentId) {
          try {
            payment = $app.dao().findRecordById('payments', paymentId)
          }
          catch (e) {
            console.log('Payment not found by ID:', paymentId)
          }
        }

        // If not found by ID, try to find by authority
        if (!payment) {
          try {
            payment = $app.dao().findFirstRecordByData('payments', 'transactionId', authority)
          }
          catch (e) {
            console.log('Payment not found by authority:', authority)
          }
        }

        if (payment) {
          payment.set('status', 'success')
          payment.set('transactionId', authority)
          $app.dao().saveRecord(payment)

          // Create or update user subscription
          const userId = payment.get('user')
          const user = $app.dao().findRecordById('users', userId)

          // Create subscription charge record
          const collection = $app.dao().findCollectionByNameOrId('charge')
          const newCharge = new Record(collection, {
            user: userId,
            totalCharge: payment.get('amount') / 1000, // Convert to charge units (assuming 1000 IRR = 1 charge unit)
            used: 0,
            duration: 43200, // 30 days in minutes (30 * 24 * 60)
            isDone: false,
            isOutDated: false,
          })
          $app.dao().saveRecord(newCharge)

          // Update user subscription status
          user.set('hasCharge', true)
          let expireTime = new Date()
          expireTime = new Date(expireTime.getTime() + 43200 * 60000) // 30 days
          user.set('expireChargeTime', expireTime)
          user.set('startChargeTime', new Date())
          $app.dao().saveRecord(user)

          return c.json(200, {
            status: 100,
            msg: 'Payment verified successfully',
            refId: verifyData.refId,
            authority: authority,
          })
        }
        else {
          // Create payment record if not found - this is a fallback
          console.log('Payment record not found, creating new one')

          // We need to get user ID from auth context - this is a fallback scenario
          // In normal flow, payment record should exist from frontend
          console.warn('Warning: Payment record not found. This might indicate an issue in the payment flow.')

          return c.json(200, {
            status: 100,
            msg: 'Payment verified successfully but record not found',
            refId: verifyData.refId,
            authority: authority,
            warning: 'Payment record was missing',
          })
        }
      }
      catch (recordError) {
        console.error('Error updating payment record:', recordError)
        return c.json(200, {
          status: 100,
          msg: 'Payment verified but record update failed',
          refId: verifyData.refId,
          authority: authority,
        })
      }
    }
    else {
      return c.json(400, {
        status: verifyData.status,
        msg: verifyData.msg || 'Payment verification failed',
        authority: authority,
      })
    }
  }
  catch (error) {
    console.error('Payment verification error:', error)
    throw new BadRequestError('Payment verification failed: ' + error.message)
  }
}, $apis.activityLogger($app))

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
