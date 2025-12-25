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
  const itn = document.querySelector('.itn').value.trim();

  // Регулярные выражения
  const namePattern = /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/;
  const postPattern = /^[А-ЯЁа-яёA-Za-z0-9\s\-]+$/;
  const cellphonePattern = /^\+7\d{10}$/;
  const phonePattern = /^8\d{9}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const itnPattern = /^\d{10}$/;

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

  if (!itnPattern.test(itn)) {
    alert('Некорректный ИНН. Введите 10 цифр.');
    return false;
  }

  // Если все проверки пройдены
  console.log('Все поля заполнены корректно.');
  return true;
}

// Изменено: после загрузки списка вызываем инициализацию поискового селекта
window.addEventListener('load', () => {
  console.log('Страница загружена, список дополняется..');

// Вызов функции заполнения и переача ей URL текстового файла и класса элемента select в который необходимо совершить заполнение
  loadOptionsIntoSelect('./files/orgList.txt', 'selectOrg');
  console.log('Cписок заполнен');

  // Инициализировать searchable select (ждёт появления опций)
  initSearchableWhenReady('selectOrg');
});

/**
 * Преобразует <select class="..."> в searchable dropdown.
 */
function makeSelectSearchable(selectClass){
  const select = document.querySelector('.' + selectClass);
  if (!select) return;
  if (select.dataset.searchable === '1') return;

  select.style.display = 'none';
  select.dataset.searchable = '1';

  const wrapper = document.createElement('div');
  wrapper.className = 'searchable-select';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Поиск организации...';
  input.className = 'searchable-input form-field'; // <-- добавлен класс form-field чтобы сохранить отступы/стили
  input.autocomplete = 'off';

  const list = document.createElement('div');
  list.className = 'searchable-options';
  list.style.display = 'none';

  function renderOptions(filter = '') {
    list.innerHTML = '';
    const f = filter.trim().toLowerCase();
    Array.from(select.options).forEach(opt => {
      if (opt.disabled) return;
      const text = opt.text.trim();
      if (f && !text.toLowerCase().includes(f)) return;
      // заменяем простую вставку текста на span с анимацией при hover
      const item = document.createElement('div');
      item.className = 'searchable-option';

      const span = document.createElement('span');
      span.className = 'option-text';
      span.textContent = text;
      item.appendChild(span);

      item.dataset.value = opt.value;
      list.appendChild(item);

      // При наведении — если текст шире контейнера, запускаем marquee
      item.addEventListener('mouseenter', () => {
        // небольшая задержка, чтобы избежать мерцания при быстром движении мыши
        // измеряем размеры
        const contW = item.clientWidth;
        const textW = span.scrollWidth;
        const diff = textW - contW;
        if (diff > 8) {
          const px = -diff; // отрицательное смещение влево
          // скорость ~ 60 px/s, минимум 2s
          const durationSec = Math.max(2, Math.abs(diff) / 60);
          item.style.setProperty('--marq-d', px + 'px');
          item.style.setProperty('--marq-t', durationSec + 's');
          item.classList.add('marquee');
        }
      });

      item.addEventListener('mouseleave', () => {
        item.classList.remove('marquee');
        item.style.removeProperty('--marq-d');
        item.style.removeProperty('--marq-t');
      });

      item.addEventListener('click', () => {
        select.value = item.dataset.value;
        input.value = span.textContent;
        closeList();
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
    if (!list.children.length){
      const none = document.createElement('div');
      none.className = 'searchable-none';
      none.textContent = 'Нет результатов';
      list.appendChild(none);
    }
  }

  function openList(){
    renderOptions(input.value);
    list.style.display = 'block';
    wrapper.classList.add('open');
  }
  function closeList(){
    list.style.display = 'none';
    wrapper.classList.remove('open');
  }

  input.addEventListener('input', () => {
    renderOptions(input.value);
    list.style.display = 'block';
  });
  input.addEventListener('focus', openList);
  document.addEventListener('click', (e) => { if (!wrapper.contains(e.target)) closeList(); });

  wrapper.appendChild(input);
  wrapper.appendChild(list);
  select.parentNode.insertBefore(wrapper, select);

  if (select.value){
    const selOpt = select.options[select.selectedIndex];
    if (selOpt) input.value = selOpt.text;
  }
  renderOptions();
}

/**
 * Ждёт появления опций в select и затем вызывает makeSelectSearchable.
 */
function initSearchableWhenReady(selectorClass, timeout = 5000){
  const select = document.querySelector('.' + selectorClass);
  if (!select) return;
  if (select.options.length > 1) { makeSelectSearchable(selectorClass); return; }
  const mo = new MutationObserver(() => {
    if (select.options.length > 0) { makeSelectSearchable(selectorClass); mo.disconnect(); }
  });
  mo.observe(select, { childList: true });
  setTimeout(() => { makeSelectSearchable(selectorClass); mo.disconnect(); }, timeout);
}

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
  "itn": document.querySelector('.itn').value,
  "selectOrg": document.querySelector('.selectOrg').value
}
    console.log('Данные прочитаны');
// Вызов функции отправки на сервер и передача ей словаря с данными
    
    writeToFileA(values);
    document.querySelector('.register-form-container').reset(); // очистка формы
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
