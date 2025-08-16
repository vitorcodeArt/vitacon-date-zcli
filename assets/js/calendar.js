let eventos = ["Evento 1", "Evento 2", "Evento 3"];
let start = [
    "2025-08-15T10:00:00",
    "2025-08-14T12:00:00",
    "2025-08-13T11:00:00",
];
let grupos = ["grupo_1", "grupo_2", "grupo_3"];
let classes = ["Visita", "Agendamento", "Recebimento"];

document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById("calendar");

    var calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: 'bootstrap5',
        initialView: "dayGridMonth",
        locale: "pt-br",
        selectable: true,
        editable: true,
        droppable: true,
        dayMaxEventRows: true,
        allDaySlot: false,
        slotDuration: "01:00:00",
        expandRows: true,
        eventMinHeight: 15,
        slotMinTime: "08:00:00",
        slotMaxTime: "20:00:00",

        customButtons: {
            filterClass: {
                text: 'Filter Class',
                click: function () {
                    // Captura todas as classes únicas
                    const allEvents = calendar.getEvents();
                    const uniqueClasses = new Set();

                    allEvents.forEach(event => {
                        event.classNames.forEach(cn => uniqueClasses.add(cn));
                    });

                    // Cria botões dinâmicos
                    const groupButtons = document.getElementById('groupButtons');
                    groupButtons.innerHTML = '';

                    // Botão para "Todos"
                    createFilterButton('Todos', '');

                    // Botões para cada classe
                    uniqueClasses.forEach(cls => {
                        createFilterButton(cls, cls);
                    });

                    // Mostra modal
                    document.getElementById('filterModal').style.display = 'block';
                }
            }
        },

        headerToolbar: {
            left: "prev,next today filterClass",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },

        dateClick: function (info) {
            let titulo = prompt("Digite o título do evento:");
            if (titulo) {
                calendar.addEvent({
                    title: titulo,
                    start: info.date,
                    allDay: true,
                    backgroundColor: getRandomColor()
                });
            }
        },

        eventClick: function (info) {
            if (confirm(`Deseja excluir o evento "${info.event.title}"?`)) {
                info.event.remove();
            }
        },

        eventDrop: function (info) {
            console.log(`Evento "${info.event.title}" movido para ${info.event.start}`);
        },

        eventResize: function (info) {
            console.log(`Evento "${info.event.title}" alterado para ${info.event.start} até ${info.event.end}`);
        }
    });

    calendar.render();

    // Adiciona eventos iniciais
    for (let i = 0; i < eventos.length; i++) {
        calendar.addEvent({
            title: eventos[i],
            start: start[i],
            backgroundColor: getGroupColor(grupos[i]),
            classNames: [grupos[i]]
        });
    }

    // Função de cor por grupo
    function getGroupColor(grupo) {
        if (grupo === "grupo_1") return "#FF6B6B";
        if (grupo === "grupo_2") return "#4ECDC4";
        if (grupo === "grupo_3") return "#FFD93D";
        return "#cccccc";
    }

    // Função para criar botões de filtro
    function createFilterButton(label, filterClass) {
        const btn = document.createElement('div');
        btn.textContent = label;
        btn.dataset.filter = filterClass;
        btn.style.padding = "8px 12px";
        btn.style.borderRadius = "6px";
        if (filterClass === '') btn.style.background = "#e2e2e2ff";
        if (filterClass === 'grupo_1') btn.style.background = "#FF6B6B";
        if (filterClass === 'grupo_2') btn.style.background = "#4ECDC4";
        if (filterClass === 'grupo_3') btn.style.background = "#FFD93D";
        btn.style.cursor = "pointer";
        btn.style.userSelect = "none";
        btn.style.fontSize = "0.9rem";
        btn.style.transition = "0.2s";

        btn.addEventListener('mouseenter', () => {
            if (filterClass === 'grupo_1' && !btn.classList.contains('active')) btn.style.background = "#fa5252ff";
            if (filterClass === 'grupo_2' && !btn.classList.contains('active')) btn.style.background = "#25afa6ff";
            if (filterClass === 'grupo_3' && !btn.classList.contains('active')) btn.style.background = "#b99918ff";
        });
        btn.addEventListener('mouseleave', () => {
            if (filterClass === 'grupo_1' && !btn.classList.contains('active')) btn.style.background = "#FF6B6B";
            if (filterClass === 'grupo_2' && !btn.classList.contains('active')) btn.style.background = "#4ECDC4";
            if (filterClass === 'grupo_3' && !btn.classList.contains('active')) btn.style.background = "#FFD93D";
        });

        btn.addEventListener('click', function () {
            document.querySelectorAll('#groupButtons div').forEach(el => {
                el.classList.remove('active');
                console.log(el.classList);
            });
            btn.classList.add('active');
            if (filterClass === '') btn.style.background = "#e2e2e2ff";
            if (filterClass === 'grupo_1') btn.style.background = "#f54242ff";
            if (filterClass === 'grupo_2') btn.style.background = "#24a098ff";
            if (filterClass === 'grupo_3') btn.style.background = "#b99b23ff";

            const classeDesejada = btn.dataset.filter;

            calendar.getEvents().forEach(event => {
                if (!classeDesejada || event.classNames.includes(classeDesejada)) {
                    event.setProp('display', 'auto');
                } else {
                    event.setProp('display', 'none');
                }
            });
        });

        document.getElementById('groupButtons').appendChild(btn);
    }

    // Fechar modal
    document.getElementById('closeFilter').addEventListener('click', function () {
        document.getElementById('filterModal').style.display = 'none';
    });

    function getRandomColor() {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
});