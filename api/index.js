const json2csv = require('json2csv').parse;
const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const port = 3000;

const fields = ['name','post','cellphone','phone','email','selectOrg']


// GET
app.get('/', (req, res)=>{
  res.status(200).send('API online')
});



// POST
app.post('/', (req, res)=>{

console.log("Новый элемент:", req.body); 

const csv = json2csv(req.body,{fields})


let filePath = `./files/${(new Date().toString().slice(4,24))}.csv`

fs.writeFile(filePath, csv, (err) => {
    if (err) {
      console.error('Ошибка при записи в файл:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Данные успешно записаны в файл:', filePath);
      res.status(200).send('Data received and saved successfully.');
    }
});


console.log(csv);
});




app.listen(port,()=>{
    console.log('APP listening on port 3000')
});
