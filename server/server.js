/*
 * Please do not actually write code like this. This purely is for the interview.
 *
 * Super lightweight server to support the following methods:
 *
 *  GET  /api/v1/like/:likeId/count
 *  GET  /api/v1/like/:likeId/user/:userId
 *  POST /api/v1/like/add
 *  POST /api/v1/like/remove
 *
 * Seamlessly handles new likes and users. No need to "create" a like or user.
 *
 * Uses "http" instead of "express" to ensure there are no 3rd-party dependencies.
 *
 * Run via: `node server.js`
 */

var http = require("http")

var port = 3001

var totalCountRegex = /^\/api\/v1\/like\/(?<likeId>.*)\/count$/
var userCountRegex = /^\/api\/v1\/like\/(?<likeId>.*)\/user\/(?<userId>.*)$/
var addLikeRegex = /^\/api\/v1\/like\/(?<action>add|remove)$/

var likes = {}

function successResponse(res, data, message) {
  console.log("success: " + message)
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
  })
  res.write(JSON.stringify(data))
  res.end()
}

function failResponse(res, message) {
  console.log("bad request: " + message)
  res.writeHead(400)
  res.end()
}

async function handle(req, res) {
  if (req.method === "GET") {
    var matchTotalCount = totalCountRegex.exec(req.url)
    var matchUserCount = userCountRegex.exec(req.url)
    if (matchTotalCount) {
      var data = Object.keys(likes[matchTotalCount.groups.likeId] || {}).length
      successResponse(res, { data }, "retrieved number of likes")
    } else if (matchUserCount) {
      var data = !!(likes[matchUserCount.groups.likeId] || {})[matchUserCount.groups.userId]
      successResponse(res, { data }, "retrieved whether user liked")
    } else {
      failResponse(res, "this path is not supported for GET requests")
    }
  } else if (req.method === "POST") {
    var match = addLikeRegex.exec(req.url)
    if (match) {
      var body = ""
      await req.on("data", (chunk) => {
        body += chunk
      })
      body = JSON.parse(body)
      if (!body.likeId || !body.userId) {
        failResponse(res, "likeId and userId are required")
      } else {
        if (likes[body.likeId] === undefined) {
          likes[body.likeId] = {}
        }
        if (match.groups.action === "add") {
          likes[body.likeId][body.userId] = true
        } else if (match.groups.action === "remove") {
          delete likes[body.likeId][body.userId]
        }
        successResponse(res, {}, `performed a ${match.groups.action}`)
      }
    } else {
      failResponse(res, "this path is not supported for POST requests")
    }
  } else if (req.method === "OPTIONS") {
    successResponse(res, {}, "no-op for options")
  } else {
    failResponse(res, "this method is not supported")
  }
}

http.createServer(handle).listen(port, () => {
  console.log(`Server running at port ${port}`)
})
