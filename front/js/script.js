// Объявление функции для загрузки данных из файла и заполнение этими данными элемента select на форме
function loadOptionsIntoSelect(url, selectElementClass) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const lines = data.split('\n').filter(line => line.trim() !== ''); // Разделение данных на строки
      const selectElements = document.getElementsByClassName(selectElementClass);
      Array.from(selectElements).forEach(selectElement => {
        lines.forEach(line => {
          const optionElement = document.createElement('option');
          optionElement.value = line;
          optionElement.textContent = line;
          selectElement.appendChild(optionElement);
        });
      });
    })
    .catch(error => console.error('Ошибка:', error));    
  }

// Обьявление функции отправки данных на сервер
function writeToFileA(values){
    console.log('Отправка данных запущена', values);
    
  fetch('https://testform.gov35.ru/node',{
    method: 'POST',
    headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
    body: JSON.stringify(values)
});
}

function inputValidation(){
  console.log('Проверка полей формы на валидность введенных данных');

  // Получение значений полей формы
  const name = document.querySelector('.name').value.trim();
  const post = document.querySelector('.post').value.trim();
  const cellphone = document.querySelector('.cellphone').value.trim();
  const phone = document.querySelector('.phone').value.trim();
  const email = document.querySelector('.email').value.trim();

  // Регулярные выражения
  const namePattern = /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/;
  const postPattern = /^[А-ЯЁа-яёA-Za-z0-9\s\-]+$/;
  const cellphonePattern = /^\+7\d{10}$/;
  const phonePattern = /^8\d{9}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Проверка каждого поля
  if (!namePattern.test(name)) {
    alert('Некорректное ФИО. Введите фамилию, имя и отчество через пробел.');
    return false;
  }

  if (!postPattern.test(post)) {
    alert('Некорректная должность. Используйте только буквы, цифры, пробелы и дефисы.');
    return false;
  }

  if (!cellphonePattern.test(cellphone)) {
    alert('Некорректный мобильный телефон. Формат: +7XXXXXXXXXX.');
    return false;
  }

  if (!phonePattern.test(phone)) {
    alert('Некорректный городской телефон. Формат: 8XXXXXXXXX.');
    return false;
  }

  if (!emailPattern.test(email)) {
    alert('Некорректный email. Проверьте формат.');
    return false;
  }

  // Если все проверки пройдены
  console.log('Все поля заполнены корректно.');
  return true;
}







// Добавление события load для вызова функции заполнения списка данными при загрузке страницы 
window.addEventListener('load', () => {
  console.log('Страница загружена, список дополняется..');

// Вызов функции заполнения и переача ей URL текстового файла и класса элемента select в который необходимо совершить заполнение
  loadOptionsIntoSelect('./files/orgList.txt', 'selectOrg');
  console.log('Cписок заполнен');
});









// Добавление события submit для вызова функции getValues при отправке формы
// Позволяет исклчить нежелательную перезагрузку страницы формы в процессе валидации
document.querySelector('.register-form-container').addEventListener('submit', getValues);

// Функция считывания данных с формы их валидация и отправка на сервер
function getValues(event){
  event.preventDefault();
  //console.clear();

// Проверка есть ли среди полей input на форме пустые значения. 
// В случае если таковое найдено происходит выход из функции и выводится предупреждение
  if (Array.from(document.querySelectorAll('.form-field')).some(field => field.value === '')) {
    console.log('Предупреждение: в массиве есть пустые значения!');
    alert('Неоходимо заполнить все поля');
    return;

  }
// Проверка валидности данных
// Если проверка не пройдена происходит выход из функции
  if (!inputValidation()) {
    return; // Выход из функции, если данные некорректны
  }


  

// Запись значений всех полей input на форме в словарь для дальнейшей отправки на сервер
let values = {
  "name": document.querySelector('.name').value,
  "post": document.querySelector('.post').value,
  "cellphone": document.querySelector('.cellphone').value,
  "phone": document.querySelector('.phone').value,
  "email": document.querySelector('.email').value,
  "selectOrg": document.querySelector('.selectOrg').value
}
    console.log('Данные прочитаны');
// Вызов функции отправки на сервер и передача ей словаря с данными
    
    writeToFileA(values);
    alert('Данные отправлены и сохранены');
}





















// Функция добавленияя новых элементов в список <select> 
// function addFunction(){
//   console.clear();
  
//   console.log("До:",selectOrg.options[selectOrg.options.length-1]);
  
//   let option = document.createElement("option");
//   option.value=selectOrg.options.length;
//   option.text=`Новая организация ${selectOrg.options.length}`;
//   selectOrg.add(option,null);

//   console.log("Организация добавлена");
//   console.log("После:",selectOrg.options[selectOrg.options.length-1]);
// }


// Функция чтения содержимого json файла
// Ассинхронный вариант
// async function writeToConsoleA(){
    // let response = await fetch('./files/users1.json')
    // let content = await response.json()
    // console.log(content)
// }

// Функция чтения содержимого json файла
// // с методом .then() синхронный вариант
// function writeToConsole(){
// fetch('https://servicetest.gov35.ru/test.txt')
// .then(response => response.text())
// .then(TEXT => console.log(TEXT));
// }

//вывод содержимого txt файла в консоль браузера
// fetch('./files/org.txt')
//   .then(response => response.text())
//   .then(data => console.log(data))
//   .catch(error => console.error('Ошибка:', error));
    

// Функция вывода данных из поля select в консоль браузера
// function logFunction(){
//     console.clear();
 
//     console.log("selectOrg.selectedOptions.length:",selectOrg.selectedOptions.length);
//     console.log("selectOrg.options.length:",selectOrg.options.length);
 
//     console.log("selected index:",selectOrg.selectedOptions[0].index);
//     console.log("selected value:",selectOrg.selectedOptions[0].value);
//     console.log("selected label:",selectOrg.selectedOptions[0].label);
//     console.log("selected text:",selectOrg.selectedOptions[0].text);   

//     writeToConsoleA();
