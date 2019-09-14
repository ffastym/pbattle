/**
 * @author Yuriy Matviyuk
 */
import React from 'react'

/**
 * PrivacyPolicy component
 *
 * @returns {*}
 * @constructor
 */
const PrivacyPolicy = () => {
  return (
    <div className="page-content privacy-policy">
      <h3>ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ</h3>
      <h4>1. Загальні положення</h4>
      <p>
        Цей документ описує політику конфіденційності для веб-додатку PhotoBattle,
        розміщеного за веб-адресою <a href="https://www.pbattle.me">https://www.pbattle.me</a> (надалі – «Додатку»).
        У цьому документі роз’яснюється, які види інформації можуть бути зібрані
        і оброблятися серверами Додатку, хмарними сховищами та сторонніми сервісами,
        що використовуються для коректної роботи Додатку, та як може використовуватися ця інформація.
      </p>
      <p>
        Даний документ не поширюється на веб-сайти, перехід на які здійснюється за
        допомогою гіперпосилань, розміщених на сторінках Додатку.
      </p>

      <h4>2. Автоматичний збір і обробка інформації</h4>
      <p>
        Для ведення аналітики відвідування та сеансів користувачів у Додатку з пристроїв
        відвідувачів автоматично збирається і зберігається наступна інформація:
      </p>
      <ul>
        <li>вид браузера та операційної системи;</li>
        <li>Ваші вік та стать;</li>
        <li>дата і час відвідування;</li>
        <li>тривалість перебування на сторінках додатку;</li>
        <li>регіон перебування та стать відвідувача;</li>
        <li>переглянуті сторінки;</li>
        <li>адреса та назва сайту або веб-додатку з якого був здійснений перехід на сторінки Додатку.</li>
        <li>інші дані, які ви надали компанії Google у обліковому записі Google</li>
      </ul>
      <h4>3. Конфіденційність</h4>
      <p>
        Усі графічні зображення, завантажені
        безпосередньо з пристрою користувача, надсилаються для зберігання на сторонній хмарний
        сервіс <a href="https://cloudinary.com">cloudinary.com</a> .
      </p>
      <h4>4. Використання плагінів соціальних мереж</h4>
      <p>
        Технічне оснащення сторінок Додатку включає в себе плагіни соціальної мережі facebook.com,
        керування якою відбувається зі штаб-квартири компанії Facebook Inc, розташованої в США,
        штат Каліфорнія, Пало Альто, Авеню Каліфорнія 94304, вул.1601 (надалі «Facebook»).
      </p>
      <p>
        Ці плагіни можуть бути кнопками «Like» або відповідно «Мені подобається», а також «Поширити»
        в мережі Facebook. Плагін передаватиме на сервер Facebook дані про те, які саме наші
        веб-сторінки Ви відвідали. Якщо Ви маєте обліковий запис на Facebook і Ви зайшли у
        систему під своїм аккаунтом, під час відвідування нашої веб-сторінки Facebook пов&apos;язуватиме
        цю інформацію з Вашим аккаунтом.
      </p>
      <p>
        У разі використання будь-яких функцій плагіна (наприклад, при натисканні кнопки
        «Мені подобається» чи коментуванні), ця інформація також буде синхронізована з Вашим
        аккаунтом на Facebook.
      </p>
      <p>
        Більш детальну інформацію про збір та використання даних мережею Facebook, а також
        про права і можливості захисту персональних даних в даному контексті можна знайти в
        розділі про захист персональних даних на сайті Facebook.
      </p>
      <p>
        Щоб уникнути зв&apos;язку мережі Facebook з нашими веб-сторінками та подальшого зв’язку
        даної інформації з Вашим аккаунтом, Вам потрібно вийти з облікового запису Facebook
        перед відвідуванням наших веб-сторінок.
      </p>
      <h4>5. Відповідальність сторін</h4>
      <p>
        Додаток надає ресурси для знайомства у інтернеті лише розважального характеру. Додаток не
        використовує засобів цензури для фільтрації текстового та графічного контенту відправленого
        випадковим співрозмовником у Додатку, тому забороняється використання ресурсу дітьми,
        що не досягли вісімнадцятирічного віку. Відповідальність за вміст повідомлень несе виключно відправник.
      </p>
      <h4>6. Зміна ПОЛІТИКИ КОНФІДЕНЦІЙНОСТІ</h4>
      <p>
        Перебуваючи на сторінках Додатку Ви автоматично погоджуєтеся з умовами конфіденційності,
        передбаченими у даному документі та підтверджуєте, що погоджуєтеся з
        тим, що дана ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ може час від часу змінюватися. Зміни, що вносяться до ПОЛІТИКИ
        КОНФІДЕНЦІЙНОСТІ, публікуються у додатку.
      </p>
    </div>
  )
}

export default PrivacyPolicy
