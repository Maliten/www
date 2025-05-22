
// Путь к <select> в переменной selectOrg, для сокращения кода
const selectOrg=document.testForm.selectOrg;

// Функция чтения содержимого файла
// Ассинхронный вариант
async function writeToConsoleA(){
    let response = await fetch('http://localhost:3000')
    let content = await response.json()
    console.log(content)
}

// // с методом .then()
// function writeToConsole(){
// fetch('https://servicetest.gov35.ru/test.txt')
// .then(response => response.text())
// .then(TEXT => console.log(TEXT));
// }





  

    

// Функция заполнения списка <select> 
function addFunction(){
    console.clear();
    
    console.log("До:",selectOrg.options[selectOrg.options.length-1]);
    
    let option = document.createElement("option");
    option.value=selectOrg.options.length;
    option.text=`Новая организация ${selectOrg.options.length}`;
    selectOrg.add(option,null);

    console.log("Организация добавлена");
    console.log("После:",selectOrg.options[selectOrg.options.length-1]);
}

// Функция вывода данных в консоль браузера
function logFunction(){
    console.clear();
 
    console.log("selectOrg.selectedOptions.length:",selectOrg.selectedOptions.length);
    console.log("selectOrg.options.length:",selectOrg.options.length);
 
    console.log("selected index:",selectOrg.selectedOptions[0].index);
    console.log("selected value:",selectOrg.selectedOptions[0].value);
    console.log("selected label:",selectOrg.selectedOptions[0].label);
    console.log("selected text:",selectOrg.selectedOptions[0].text);   

//    writeToConsoleA();

}




// Функция записи данных в файл



let user = {
  "name": "Liza",
  "email": "liza@gmail.com",
  "phone": 98489854
}


 function writeToFileA(){
  fetch('https://testform.gov35.ru/node',{
    method: 'POST',
    headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
    body: JSON.stringify(user)
}).then((response) => {
    console.log("response.status =", response.status); // response.status = 200
    return response.blob();
  })
};

//  fetch('/files/posts.json', {
//     method: 'POST',
//     body: JSON.stringify({
//       title: 'foo',
//       body: 'bar',
//       userId: 1,
//     }),
//     headers: {
//       'Content-type': 'application/json; charset=UTF-8',
//     },
//   })
//     .then((response) => response.json())
//     .then((json) => console.log(json));










//    let index = document.testForm.selectOrg.options.selectedIndex;
//    let form = document.testForm.selectOrg;  

//    console.log("selected:",document.testForm.selectOrg.options[index]);
//    console.log("Index:",form.options[index].index);
//    console.log("Text:",form.options[index].text);
//    console.log("Value:",form.options[index].value);