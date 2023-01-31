const express = require("express")
const app = express()
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send({message : "hi"})
})

app.post('/reg', (req, res) => {
   console.log(req.body)
   res.send({'status' : 'ok'})
})

app.listen(3000, () => {
    console.log("server started")
})