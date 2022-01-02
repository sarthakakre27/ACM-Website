const express = require('express')
const router = express.Router()
const Problem = require('../../models/Problem')

const auth = require('../../middleware/auth')


router.get('/get-problems',async(req,res)=>{

    try{

        projection_doc={name:1,_id :1}
        const problems = await Problem.find({},projection_doc)

        res.json(problems)
    }catch(err){
        res.status(500).json({ message:err.message })
    }
})


router.get('/problem-details/:id',async(req,res)=>{
    try{
        const problem = await Problem.find({
            user_id : req.params.id
          })
        res.json(problem)
    }catch(err){
        res.status(500).json({ message:err.message })
    }
})




// post a question

let p1 = new Problem({
    name: "missing number",
    statement: "You are given all numbers between 1,2,…,n except one. Your task is to find the missing number.",
    inputStructure:
        "The first input line contains an integer n.The second line contains n−1 numbers. Each number is distinct and between 1 and n (inclusive).",
    outputStructure: "Print the missing number.",
    constraints: {
        description: "2≤n≤2x105",
        timLim: 3,
        memLim: 100000,
    },
    testCases: [
        {
            input: "2\n2",
            output: "1",
        },
        {
            input: "5\n5 2 1 3",
            output: "4",
        },
        {
            input: "10\n2 8 10 6 5 1 3 7 4",
            output: "9",
        },
        {
            input: "100\n27 4 16 47 24 38 61 94 98 79 22 50 75 89 64 78 9 10 30 76 73 58 21 37 44 70 60 45 12 92 84 34 25 57 90 96 69 20 97 87 67 65 83 33 40 74 95 39 100 48 53 59 19 1 28 66 72 54 68 2 32 91 86 6 13 62 81 5 17 77 41 35 99 14 80 56 36 31 29 85 7 11 8 93 15 88 43 3 52 82 51 26 55 63 42 23 49 46 18",
            output: "71",
        },
    ],
});

p1.save();



module.exports = router