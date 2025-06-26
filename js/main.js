document.addEventListener("DOMContentLoaded", function () {
    // Создаем таблицу при загрузке страницы
    createTable(movies, 'list');

    // Находим кнопку "Найти" по её значению (value)
    let findButton = document.querySelector('input[value="Найти"]');

    // Добавляем обработчик события click для кнопки "Найти"
    if (findButton) {
        findButton.addEventListener("click", function () {
            // Получаем форму с фильтрами
            let filterForm = document.getElementById("filter");

            // Вызываем функцию filterTable с параметрами
            filterTable(movies, 'list', filterForm);
        });
    }

    // Находим кнопку "Очистить фильтры" по её значению (value)
    let clearButton = document.querySelector('input[value="Очистить фильтры"]');

    // Добавляем обработчик события click для кнопки "Очистить фильтры"
    if (clearButton) {
        clearButton.addEventListener("click", function () {
            // Получаем форму с фильтрами
            let filterForm = document.getElementById("filter");

            // Вызываем функцию clearFilter с параметрами
            clearFilter('list', movies, filterForm);
        });
    }

    // Инициализация полей сортировки
    let sortForm = document.getElementById("sort");
    if (sortForm && movies.length > 0) {
        setSortSelects(movies[0], sortForm);

        // Находим поле для первого уровня сортировки
        let fieldsFirst = document.getElementById("fieldsFirst");

        // Добавляем обработчик события change для первого уровня сортировки
        if (fieldsFirst) {
            fieldsFirst.addEventListener("change", function () {
                // Настраиваем поле для второго уровня сортировки
                changeNextSelect("fieldsSecond", fieldsFirst);
            });
        }

        // Находим поле для второго уровня сортировки
        let fieldsSecond = document.getElementById("fieldsSecond");

        // Добавляем обработчик события change для второго уровня сортировки
        if (fieldsSecond) {
            fieldsSecond.addEventListener("change", function () {
                // Настраиваем поле для третьего уровня сортировки
                changeNextSelect("fieldsThird", fieldsSecond);
            });
        }

        // Находим кнопку "Сортировать" по её значению (value)
        let sortButton = document.querySelector('input[value="Сортировать"]');

        // Добавляем обработчик события click для кнопки "Сортировать"
        if (sortButton) {
            sortButton.addEventListener("click", function () {
                // Вызываем функцию sortTable с параметрами
                sortTable('list', sortForm);
            });
        }

        // Находим кнопку "Сбросить сортировку" по её значению (value)
        let resetSortButton = document.querySelector('input[value="Сбросить сортировку"]');

        // Добавляем обработчик события click для кнопки "Сбросить сортировку"
        if (resetSortButton) {
            resetSortButton.addEventListener("click", function () {
                // Вызываем функцию resetSort с параметрами
                resetSort('list', sortForm);
            });
        }
    }
});

// Кнопка для построения графика
let button2 = d3.select("#draw");
button2.on("click", function() {
    let check1 = d3.select("#check1").node().checked;
    let check2 = d3.select("#check2").node().checked;

    if (!check1 && !check2) {
        d3.select("#error-message")
            .text("Выберите хотя бы один график для отображения!")
            .style("color", "red");
        d3.select("#check1").node().parentElement.style.color = "red";
        d3.select("#check2").node().parentElement.style.color = "red";
        return;
    }

    // Получаем текущие отфильтрованные данные из таблицы
    let filteredData = getFilteredDataFromTable();
    
    if (filteredData.length === 0) {
        d3.select("#error-message")
            .text("Нет данных для отображения! Проверьте фильтры.")
            .style("color", "red");
        return;
    }

    d3.select("#error-message").text("");
    d3.select("#check1").node().parentElement.style.color = "";
    d3.select("#check2").node().parentElement.style.color = "";
    
    // Передаем отфильтрованные данные в drawGraph
    drawGraph(filteredData);
});

// обработчики событий для автоматического снятия ошибок
d3.select("#check1").on("change", function () {
    if (d3.select("#check1").node().checked || d3.select("#check2").node().checked) {
        d3.select("#error-message").text("");
        d3.select("#check1").node().parentElement.style.color = "";
        d3.select("#check2").node().parentElement.style.color = "";
    }
});

d3.select("#check2").on("change", function () {
    if (d3.select("#check1").node().checked || d3.select("#check2").node().checked) {
        d3.select("#error-message").text("");
        d3.select("#check1").node().parentElement.style.color = "";
        d3.select("#check2").node().parentElement.style.color = "";
    }
    });

// Добавьте эту функцию для получения данных из таблицы
function getFilteredDataFromTable() {
let table = document.getElementById("list");
let rows = table.rows;
let filteredData = [];

// Пропускаем заголовок (первую строку)
for (let i = 1; i < rows.length; i++) {
    let cells = rows[i].cells;
    filteredData.push({
        "Номер": cells[0].textContent,
        "Название фильма": cells[1].textContent,
        "Режиссёр": cells[2].textContent,
        "Год выпуска": parseInt(cells[3].textContent),
        "Жанр": cells[4].textContent,
        "Рейтинг": parseFloat(cells[5].textContent)
    });
}

return filteredData;
}

// Функция для создания одной опции в select
let createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
};

// Функция для заполнения select опциями
let setSortSelect = (arr, sortSelect) => {
    // Создаем OPTION "Нет" и добавляем её в SELECT
    sortSelect.append(createOption('Нет', 0));

    // Перебираем все элементы массива и создаем OPTION для каждого
    for (let i in arr) {
        // Создаем OPTION из очередного элемента массива и добавляем в SELECT
        // Значение атрибута VAL увеличиваем на 1, так как значение 0 имеет опция "Нет"
        sortSelect.append(createOption(arr[i], Number(i) + 1));
    }
};

// Функция для формирования полей со списком для многоуровневой сортировки
let setSortSelects = (data, dataForm) => {
    // Выделяем ключи словаря в массив
    let head = Object.keys(data);

    // Находим все SELECT в форме
    let allSelect = dataForm.getElementsByTagName('select');

    // Перебираем все SELECT и заполняем их опциями
    for (let j = 0; j < allSelect.length; j++) {
        // Формируем очередной SELECT
        setSortSelect(head, allSelect[j]);

        // Все SELECT, кроме первого, делаем недоступными для изменения
        if (j > 0) {
            allSelect[j].disabled = true;
        }
    }
};

// Настраиваем поле для следующего уровня сортировки и отключаем все последующие, если выбрано "Нет"
let changeNextSelect = (nextSelectId, curSelect) => {
    let nextSelect = document.getElementById(nextSelectId);
    
    // Если текущий выбор - "Нет" (значение 0), отключаем ВСЕ последующие select
    if (curSelect.value == 0) {
        let allSelects = document.querySelectorAll('#sort select');
        let foundCurrent = false;
        
        allSelects.forEach(select => {
            if (select === curSelect) {
                foundCurrent = true;
            } else if (foundCurrent) {
                select.disabled = true;
                select.selectedIndex = 0; // Сбрасываем выбор
            }
        });
        return;
    }

    nextSelect.disabled = false;
    nextSelect.innerHTML = curSelect.innerHTML;
    nextSelect.remove(curSelect.value);
};