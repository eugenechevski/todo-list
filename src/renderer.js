import Popover from 'bootstrap/js/dist/popover';

/**
 * The module is dealing with DOM-manipulation.
 *
 * @param Controller - object associated with the back-end logic.
 */
export default function (Controller) {
    const searchInputEl = document.querySelector('#taskSearchInput');
    const notificationListEl = document.querySelector('#notifList');
    const notificationProtoEl = document.querySelector('#notifProto');

    const taskProtoEl = document.querySelector('#taskProto');
    const taskViewEl = document.querySelector('#tasksViewCont');
    const tasksContentEl = document.querySelector('#tasksContent');
    const taskBottomEl = document.querySelector('#taskBottom');
    const taskToolsEl = document.querySelector('#taskTools');
    const taskInputEl = document.querySelector('#taskInput');
    const taskNameInputEl = document.querySelector('#taskNameInput');
    const taskDateInputEl = document.querySelector('#taskDateInput');
    const taskTimeInputEl = document.querySelector('#taskTimeInput');
    const taskPriorityListEl = document.querySelectorAll('.priority');
    const addTaskBtnEl = document.querySelector('#addTaskBtn');
    const removeTaskBtnEl = document.querySelector('#removeTaskBtn');
    const editTaskBtnEl = document.querySelector('#editTaskBtn');
    const moveTaskBtnEl = document.querySelector('#moveTaskBtn');
    const moveToProtoEl = document.querySelector('#moveToProto');
    const cancelTaskBtn = document.querySelector('#taskCancelBtn');

    const listsTogglerEl = document.querySelector('#listsToggler');
    const navTogglerEl = document.querySelector('#navbarToggler');

    const listProtoEl = document.querySelector('#listProto');
    const listViewEl = document.querySelector('#listsViewCont');
    const listsContentEl = document.querySelector('#listsContent');
    const listToolsEl = document.querySelector('#listTools');
    const listInputEl = document.querySelector('#listInput');
    const listNameInputEl = document.querySelector('#listNameInput');
    const listIconPickEl = document.querySelector('#listIconPick');
    const addListBtnEl = document.querySelector('#addListBtn');
    const removeListBtnEl = document.querySelector('#removeListBtn');
    const editListBtnEl = document.querySelector('#editListBtn');
    const confirmListBtnEl = document.querySelector('#listConfirmBtn');
    const cancelListBtnEl = document.querySelector('#listCancelBtn');

    const tasksContentHeight = tasksContentEl.clientHeight;
    const popoverOptions = {
        animation: true,
        placement: 'top',
        fallbackPlacements: ['top', 'right', 'bottom', 'left'],
        trigger: 'focus',
        customClass: 'border border-dark',
    };

    let currentPriority = taskPriorityListEl[0];
    let currentList = document.querySelector('#homeList');

    let prevSearchTerm = '';
    const displayedTasks = {};

    let editListMode = false;
    let editTaskMode = false;

    // eslint-disable-next-line no-use-before-define
    init();

    function showListInput() {
        listToolsEl.remove();
        listViewEl.append(listInputEl);
    }

    function showTaskInput() {
        // Show input
        taskToolsEl.remove();
        taskBottomEl.appendChild(taskInputEl);

        // Responsive behavior
        if (window.innerWidth < 576) {
            const newHeight = tasksContentHeight - taskInputEl.clientHeight + 35;
            tasksContentEl.style.height = `${newHeight}px`;
        }
    }

    /**
     * Responds to the add-list click.
     */
    function handleAddList() {
        // Clear input
        listIconPickEl.innerHTML = '🔵';
        listNameInputEl.value = '';

        showListInput();
    }

    /**
     * Responds to the remove-list click and forwards its handling to Controller.
     */
    function handleRemoveList() {
        const removedList = currentList;
        handleSelectList(document.getElementById('homeList'));
        Controller.removeList(removedList.id);
    }

    /**
     * Responds to the edit-list click.
     */
    function handleEditList() {
        // Sanitize the input
        const listIcon = currentList.querySelector('.list-icon').innerHTML;
        const listName = currentList.querySelector('.list-name').innerHTML;

        // Set the input
        listIconPickEl.innerHTML = listIcon;
        listNameInputEl.value = listName;

        // Update the mode-flag
        if (!editListMode) {
            editListMode = true;
            showListInput();
        }
    }

    /**
     * Responds to the confirm-list click and forwards its handling to Controller.
     */
    function handleConfirmList() {
        // Grab the name
        const givenName = listNameInputEl.value;

        // Validate the name
        if (givenName === '') {
            Popover.getInstance(listNameInputEl)?.hide();
            popoverOptions.content = 'List name has to have at least one character.';
            popoverOptions.container = listInputEl;
            Popover.getOrCreateInstance(listNameInputEl, popoverOptions).show();
            return;
        }

        // Grab the icon
        const givenIcon = listIconPickEl.innerHTML;

        // Pack it up
        const options = {
            name: givenName,
            icon: givenIcon,
        };

        // Forward it
        const validList = editListMode
            ? Controller.editList(currentList.id, options)
            : Controller.addList(options);

        if (!validList) {
            Popover.getInstance(listNameInputEl)?.hide();
            popoverOptions.content = 'Two lists with the same credentials are not allowed.';
            popoverOptions.container = listInputEl;
            Popover.getOrCreateInstance(listNameInputEl, popoverOptions).show();
        } else {
            handleCancelList();
        }
    }

    /**
     * Resets the list-input mode.
     */
    function handleCancelList() {
        listInputEl.remove();
        listViewEl.appendChild(listToolsEl);

        // Reset the mode-flag
        editListMode = false;

        Popover.getInstance(listNameInputEl)?.hide();
    }

    /**
     * Responds to the add-task click.
     */
    function handleAddTask() {
        showTaskInput();

        // Obtain the date

        const now = new Date(Date.now());
        const year = now.getFullYear().toString();
        let month = (now.getMonth() + 1).toString();
        month = '0'.repeat(2 - month.length) + month;
        let day = now.getDate().toString();
        day = '0'.repeat(2 - day.length) + day;

        let hours = now.getHours();
        hours = '0'.repeat(2 - hours.length) + hours;
        let minutes = now.getMinutes().toString();
        minutes = '0'.repeat(2 - minutes.length) + minutes;

        // Set input
        taskNameInputEl.value = '';
        taskDateInputEl.value = `${year}-${month}-${day}`;
        taskTimeInputEl.value = `${hours}:${minutes}`;
    }

    /**
     * Responds to the remove-task click and forwards its handling to Controller.
     */
    function handleRemoveTask() {
        let parentEl;
        document
            .querySelectorAll('input[type="checkbox"]:checked')
            .forEach((elTask) => {
                parentEl = elTask.parentElement.parentElement;
                Controller.removeTask(
                    parentEl.querySelector('.list-label').id.slice(9),
                    parentEl.id,
                );
            });
    }

    /**
     * Responds to the edit-task click.
     */
    function handleEditTask() {
        showTaskInput();

        // Sanitize the input

        const selectedTask = document.querySelector(
            'input[type="checkbox"]:checked',
        ).parentElement.parentElement;

        const taskName = selectedTask.querySelector('.name-label').innerHTML;
        const taskPriority = selectedTask.querySelector('.priority-label').innerHTML;
        let taskDate = selectedTask.querySelector('.date-field').innerHTML;
        const taskTime = selectedTask.querySelector('.time-field').innerHTML;

        taskNameInputEl.value = taskName;

        let priorityID;

        if (taskPriority.startsWith('Low')) {
            priorityID = 'low';
        } else if (taskPriority.startsWith('Medium')) {
            priorityID = 'medium';
        } else if (taskPriority.startsWith('High')) {
            priorityID = 'high';
        }

        handleSelectPriority(document.getElementById(priorityID));

        // mm/dd/yyyy -> yyyy-mm-dd
        taskDate = taskDate.split('/');
        taskDateInputEl.value = `${taskDate[2]}-${'0'.repeat(
            2 - taskDate[0].length,
        )}${taskDate[0]}-${'0'.repeat(2 - taskDate[1].length)}${taskDate[1]}`;

        // HH:MM AM/PM (12 hr) -> HH:MM (24 hr)
        const colon = taskTime.indexOf(':');
        let hours = taskTime.slice(0, colon);
        hours = taskTime.endsWith('PM') && hours < 12 ? 12 + Number(hours) : hours;
        const minutes = taskTime.slice(colon + 1, colon + 3);

        taskTimeInputEl.value = `${hours}:${minutes}`;

        // Update the mode-flag
        editTaskMode = true;
    }

    /**
     * Responds to the move-task click and forwards its handling to Controller.
     *
     * @param {string} destListID - id of a list where the task needs to be moved to
     */
    function handleMoveTask(destListID) {
        let taskID;
        let listID;
        const redraw = currentList.id === 'homeList';
        document
            .querySelectorAll('input[type="checkbox"]:checked')
            .forEach((elTask) => {
                taskID = elTask.id.slice(0, -5);
                listID = elTask.parentElement.parentElement
                    .querySelector('.list-label')
                    .id.slice(9);
                Controller.moveTask(listID, destListID, taskID, redraw);
            });
    }

    /**
     * Responds to the confirm-task click and forwards its handling to Controller.
     */
    function handleConfirmTask() {
        let isValid = true;

        // Validate name

        const givenName = taskNameInputEl.value;

        if (givenName === '') {
            popoverOptions.content = 'Name has to have at least one character.';
            popoverOptions.container = taskNameInputEl.parentElement;
            Popover.getOrCreateInstance(taskNameInputEl, popoverOptions).show();

            isValid = false;
        }

        // Validate time

        let givenDate;
        const now = new Date(Date.now());
        if (taskDateInputEl.value === '') {
            givenDate = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
        } else {
            givenDate = taskDateInputEl.value.split('-');
        }

        const givenYear = givenDate[0];
        const givenMonth = givenDate[1];
        const givenDay = givenDate[2];

        const givenHours = taskTimeInputEl.value.slice(0, 2);
        const givenMinutes = taskTimeInputEl.value.slice(3);

        const givenTimestamp = new Date();

        givenTimestamp.setFullYear(
            Number(givenYear),
            Number(givenMonth - 1),
            Number(givenDay),
        );
        givenTimestamp.setHours(Number(givenHours), Number(givenMinutes));

        if (givenTimestamp <= now) {
            popoverOptions.content = 'Time set has to be in the future!';
            popoverOptions.container = taskNameInputEl.parentElement;
            Popover.getOrCreateInstance(taskDateInputEl, popoverOptions).show();

            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Grab the priority
        const givenPriority = currentPriority.innerHTML;

        // Ship it

        const options = {
            name: givenName,
            date: [givenMonth, givenDay, givenYear],
            time: [
                givenHours > 12 ? givenHours - 12 : givenHours,
                givenMinutes,
                givenHours >= 12 ? 'PM' : 'AM',
            ],
            priority: givenPriority,
        };

        if (editTaskMode) {
            const elTaskCheck = document.querySelector(
                'input[type="checkbox"]:checked',
            );
            const taskID = elTaskCheck.id.slice(0, -5);
            const listID = elTaskCheck.parentElement.parentElement
                .querySelector('.list-label')
                .id.slice(9);

            Controller.editTask(listID, taskID, options);
        } else {
            Controller.addTask(currentList.id, options);
        }

        // Remove the input
        handleCancelTask();
    }

    /**
     * Resets the task-input mode.
     */
    function handleCancelTask() {
        // Responsive behavior
        if (window.innerWidth < 576) {
            tasksContentEl.style.height = `${tasksContentHeight}px`;
        }

        Popover.getInstance(taskNameInputEl)?.hide();
        Popover.getInstance(taskDateInputEl)?.hide();

        taskInputEl.remove();
        taskBottomEl.appendChild(taskToolsEl);
        editTaskMode = false;
    }

    /**
     * Responds to the opening/closing of the list-menu.
     */
    function handleToggleLists() {
        if (window.innerWidth > 576) {
            if (listsTogglerEl.classList.contains('bi-arrow-right')) {
                listsTogglerEl.classList.remove('bi-arrow-right');
                listsTogglerEl.classList.add('bi-arrow-left');
            } else {
                listsTogglerEl.classList.remove('bi-arrow-left');
                listsTogglerEl.classList.add('bi-arrow-right');
            }
        } else if (navTogglerEl.classList.contains('bi-list')) {
            navTogglerEl.classList.remove('bi-list');
            navTogglerEl.classList.add('bi-x');
        } else {
            navTogglerEl.classList.remove('bi-x');
            navTogglerEl.classList.add('bi-list');
        }

        listViewEl.classList.toggle('expanded');
        taskViewEl.classList.toggle('shrinked');
    }

    /**
     * Responds to a list-selection and forwards its handling to Controller.
     *
     * @param {HTMLElement} selectedList - list to be rendered
     */
    function handleSelectList(selectedList) {
        if (
            currentList === selectedList
            || (selectedList.id === 'homeList' && editListMode)
        ) {
            return;
        }

        // Close the input
        if (taskInputEl.isConnected) {
            handleCancelTask();
        }

        // Reset the moving-list
        if (currentList.id !== 'homeList') {
            moveTaskBtnEl.nextElementSibling.querySelector(
                `#moveTo${currentList.id}`,
            ).style.display = 'block';
        }
        if (selectedList.id !== 'homeList') {
            moveTaskBtnEl.nextElementSibling.querySelector(
                `#moveTo${selectedList.id}`,
            ).style.display = 'none';
        }

        // Responsive behavior of list-tools
        if (selectedList.id === 'homeList') {
            removeListBtnEl.remove();
            editListBtnEl.remove();
        } else if (listToolsEl.children.length === 1) {
            listToolsEl.appendChild(removeListBtnEl);
            listToolsEl.appendChild(editListBtnEl);
        }

        // Reset task-tools
        document
            .querySelectorAll('input[type="checkbox"]:checked')
            .forEach((checkInput) => {
                checkInput.checked = false;
            });
        handleSelectTask();

        // Update classes of lists
        currentList.classList.remove('active');
        selectedList.classList.add('active');

        // Update the title
        document.getElementById('infoHeader').querySelector('.title').innerHTML = selectedList.querySelector('.list-name').innerHTML;

        // Reset the state
        currentList = selectedList;

        // Render the new list
        Controller.listView(selectedList.id, displayedTasks);

        if (editListMode) {
            handleEditList();
        }
    }

    /**
     * Responds to a task-selection.
     */
    function handleSelectTask() {
        // Responsive behavior of task-tools

        const nSelected = document.querySelectorAll(
            'input[type="checkbox"]:checked',
        ).length;

        if (nSelected === 0) {
            removeTaskBtnEl.parentElement.remove();
            editTaskBtnEl.parentElement.remove();
            moveTaskBtnEl.parentElement.remove();
        } else if (nSelected === 1) {
            if (taskToolsEl.children.length === 3) {
                taskToolsEl.insertBefore(
                    editTaskBtnEl.parentElement,
                    moveTaskBtnEl.parentElement,
                );
            } else {
                taskToolsEl.appendChild(removeTaskBtnEl.parentElement);
                taskToolsEl.appendChild(editTaskBtnEl.parentElement);
                taskToolsEl.appendChild(moveTaskBtnEl.parentElement);
            }
        } else {
            editTaskBtnEl.parentElement.remove();
        }
    }

    /**
     * Responds to a priority-selection from task-input.
     *
     * @param {HTMLElement} elPriorityInput - element associated with a selected priority
     */
    function handleSelectPriority(elPriorityInput) {
        if (currentPriority === elPriorityInput) {
            return;
        }

        currentPriority.removeAttribute('aria-current');
        currentPriority.classList.remove('active-priority');

        elPriorityInput.setAttribute('aria-current', 'true');
        elPriorityInput.classList.add('active-priority');

        currentPriority = elPriorityInput;
    }

    /**
     * Responds to a search and forwards its handling to Controller.
     */
    function handleSearch() {
        let searchTerm = this.value;

        if (prevSearchTerm === '' && searchTerm === '') {
            return;
        }
        if (prevSearchTerm !== '' && searchTerm === '') {
            searchTerm = /./;
        }

        Controller.searchView(currentList.id, searchTerm, displayedTasks);
        prevSearchTerm = searchTerm;
    }

    /**
     * Responds to a sort and forwards its handling to Controller.
     *
     * @param {string} criteria
     */
    function handleFilter(criteria) {
        Controller.sortTasks(criteria, displayedTasks);
    }

    /**
     * Creates a new DOM-element for a new list and populates it with given data.
     *
     * @param {List} list - object of a new list
     */
    function drawList(list) {
        // Copy the template
        const elNewList = listProtoEl.cloneNode(true);

        // Configure the new element

        elNewList.id = list.getID();
        elNewList.addEventListener(
            'click',
            handleSelectList.bind(null, elNewList),
        );
        elNewList.children[0].innerHTML = list.getIcon();
        elNewList.children[1].innerHTML = list.getName();

        listsContentEl.appendChild(elNewList);

        // Add the reference to the moving-list

        const elListRef = moveToProtoEl.cloneNode(true);
        elListRef.id = `moveTo${list.getID()}`;
        elListRef.addEventListener(
            'click',
            handleMoveTask.bind(null, list.getID()),
        );
        elListRef.children[0].innerHTML = `${list.getIcon()} ${list.getName()}`;

        moveTaskBtnEl.nextElementSibling.appendChild(elListRef);
    }

    /**
     * Removes a DOM-element of a given list.
     *
     * @param {string} givenListId - id of a list to be removed
     */
    function eraseList(givenListId) {
        document.getElementById(givenListId).remove();
    }

    /**
     * Updates a DOM-element of a given list.
     *
     * @param {List} updatedList - object of a list to be updated
     */
    function redrawList(updatedList) {
        const elUpdatedList = document.getElementById(updatedList.getID());

        elUpdatedList.querySelector('.list-icon').innerHTML = updatedList.getIcon();
        elUpdatedList.querySelector('.list-name').innerHTML = updatedList.getName();
    }

    /**
     * Creates a DOM-element of a given task.
     *
     * @param {Task} task - object of a task to be created
     */
    function drawTask(task) {
        // Copy the template
        const elNewTask = taskProtoEl.cloneNode(true);

        // Configure the new element

        // Add name
        elNewTask.id = task.getID();
        elNewTask.addEventListener(
            'click',
            handleSelectTask.bind(null, elNewTask),
        );
        elNewTask.querySelector('input').id = `${task.getID()}Check`;
        elNewTask.querySelector('.name-label').innerHTML = task.getName();
        elNewTask
            .querySelector('.name-label')
            .setAttribute('for', `${task.getID()}Check`);

        // Add priority
        const givenPriority = task.getPriority();
        elNewTask.querySelector('.priority-label').innerHTML = givenPriority;
        if (givenPriority.startsWith('High')) {
            elNewTask.querySelector('.priority-label').classList.add('high');
        } else if (givenPriority.startsWith('Medium')) {
            elNewTask.querySelector('.priority-label').classList.add('medium');
        } else if (givenPriority.startsWith('Low')) {
            elNewTask.querySelector('.priority-label').classList.add('low');
        }

        // Add list
        elNewTask.querySelector('.list-label').innerHTML = `${task
            .getList()
            .getIcon()} ${task.getList().getName()}`;
        elNewTask.querySelector('.list-label').id = `listLabel${task
            .getList()
            .getID()}`;
        if (currentList.id === 'homeList') {
            elNewTask.querySelector('.list-label').classList.remove('hide');
        } else {
            elNewTask.querySelector('.list-label').classList.add('hide');
        }

        // Add date
        const givenDate = task.getDate();
        elNewTask.querySelector(
            '.date-field',
        ).innerHTML = `${givenDate[0]}/${givenDate[1]}/${givenDate[2]}`;

        // Add time
        const givenTime = task.getTime();
        const givenHours = givenTime[0];
        const givenMinutes = givenTime[1];
        const givenPeriod = givenTime[2];

        elNewTask.querySelector(
            '.time-field',
        ).innerHTML = `${givenHours}:${givenMinutes} ${givenPeriod}`;

        if (task.getDue()) {
            elNewTask.querySelector('.time-field').classList.add('due');
            elNewTask.querySelector('.date-field').classList.add('due');
        }

        // Add to the map
        displayedTasks[task.getID()] = task.getList().getID();
        tasksContentEl.appendChild(elNewTask);
    }

    /**
     * Removes a DOM-element of a given task.
     *
     * @param {string} givenTaskId - id of a task to be removed
     */
    function eraseTask(givenTaskId) {
        // Update the display
        document.getElementById(givenTaskId).remove();
        delete displayedTasks[givenTaskId];
    }

    /**
     * Updates a DOM-element of a given task.
     *
     * @param {Task} updatedTask - object of a task to be updated
     */
    function redrawTask(updatedTask) {
        const taskID = updatedTask.getID();

        // Update the name
        document.getElementById(taskID).querySelector('.name-label').innerHTML = updatedTask.getName();

        // Update the priority

        const newPriority = updatedTask.getPriority();
        const oldPriority = document
            .getElementById(taskID)
            .querySelector('.priority-label').innerHTML;
        let newClass;
        let oldClass;

        if (newPriority.startsWith('High')) {
            newClass = 'high';
        } else if (newPriority.startsWith('Medium')) {
            newClass = 'medium';
        } else if (newPriority.startsWith('Low')) {
            newClass = 'low';
        }

        if (oldPriority.startsWith('High')) {
            oldClass = 'high';
        } else if (oldPriority.startsWith('Medium')) {
            oldClass = 'medium';
        } else if (oldPriority.startsWith('Low')) {
            oldClass = 'low';
        }

        document
            .getElementById(taskID)
            .querySelector('.priority-label')
            .classList.remove(oldClass);
        document
            .getElementById(taskID)
            .querySelector('.priority-label')
            .classList.add(newClass);
        document.getElementById(taskID).querySelector('.priority-label').innerHTML = newPriority;

        // Update the list
        document
            .getElementById(taskID)
            .querySelector('.list-label').innerHTML = `${updatedTask
                .getList()
                .getIcon()} ${updatedTask.getList().getName()}`;
        document
            .getElementById(taskID)
            .querySelector('.list-label').id = `listLabel${updatedTask
                .getList()
                .getID()}`;

        // Update the date

        const givenDate = updatedTask.getDate();
        document
            .getElementById(taskID)
            .querySelector(
                '.date-field',
            ).innerHTML = `${givenDate[0]}/${givenDate[1]}/${givenDate[2]}`;

        // Update the time

        const givenTime = updatedTask.getTime();
        document
            .getElementById(taskID)
            .querySelector(
                '.time-field',
            ).innerHTML = `${givenTime[0]}:${givenTime[1]} ${givenTime[2]}`;

        document
            .getElementById(taskID)
            .querySelector('.date-field')
            .classList.remove('due');
        document
            .getElementById(taskID)
            .querySelector('.time-field')
            .classList.remove('due');

        // Update the map
        displayedTasks[updatedTask.getID()] = updatedTask.getList().getID();
    }

    /**
     * Creates a DOM-element of a notification of a given task.
     *
     * @param {Task} task - notification's task
     */
    function drawNotification(task) {
        // Check if the element is already exist
        if (document.querySelector(`#notif${task.getID()}`) != null) {
            return;
        }

        const list = task.getList();

        // Update the bell with the red circle
        document.querySelector('.red-circle').style.opacity = '1';

        // Copy the template
        const elNotif = notificationProtoEl.cloneNode(true);

        // Configure the element
        elNotif.id = `notif${task.getID()}`;
        elNotif.children[0].innerHTML = `${list.getIcon()} ${list.getName()}`;
        elNotif.children[1].innerHTML = `${task.getName()} is due`;

        notificationListEl.appendChild(elNotif);
    }

    /**
     * Removes a DOM-element of a task's notification
     *
     * @param {string} givenTaskId - id of a notification's task
     */
    function eraseNotification(givenTaskId) {
        document.querySelector(`#notif${givenTaskId}`).remove();

        // Update the bell with the red circle
        if (notificationListEl.children.length === 0) {
            document.querySelector('.red-circle').style.opacity = '0';
        }
    }

    /**
     * Updates a DOM-element that displays task count of a given list.
     *
     * @param {string} givenListId - id of a list that associated with the count
     * @param {number} change - update for the count
     */
    function updateTaskCount(givenListId, change) {
        const elTaskCount = document
            .getElementById(givenListId)
            .querySelector('.task-count');
        const count = Number(elTaskCount.innerHTML) + change;
        elTaskCount.innerHTML = count;
    }

    /**
     * Updates the DOM-element that displays count of due-tasks.
     *
     * @param {number} change - update for the count
     */
    function updateDueCount(change) {
        let count;

        if (change === 0) {
            count = 0;
        } else {
            count = Number(document.querySelector('#dueCount').innerHTML) + change;
        }

        document.querySelector('#dueCount').innerHTML = count;
    }

    /**
     * Configures global variables.
     */
    function init() {
        document.querySelector('#bellBtn').addEventListener('click', () => {
            document.querySelector('.red-circle').style.opacity = '0';
        });
        document.querySelectorAll('.filterLink').forEach((filter) => {
            filter.addEventListener(
                'click',
                handleFilter.bind(null, filter.innerHTML),
            );
        });
        searchInputEl.addEventListener('keypress', (e) => {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
        });
        searchInputEl.addEventListener(
            'input',
            handleSearch.bind(searchInputEl, null),
        );

        addListBtnEl.addEventListener('click', handleAddList);
        removeListBtnEl.addEventListener('click', handleRemoveList);
        editListBtnEl.addEventListener('click', handleEditList);
        confirmListBtnEl.addEventListener('click', handleConfirmList);
        cancelListBtnEl.addEventListener('click', handleCancelList);
        document
            .querySelector('emoji-picker')
            .addEventListener('emoji-click', (event) => {
                listIconPickEl.innerHTML = event.detail.unicode;
            });
        document.querySelectorAll('.list').forEach((list) => {
            list.addEventListener('click', handleSelectList.bind(null, list));
        });

        addTaskBtnEl.addEventListener('click', handleAddTask);
        removeTaskBtnEl.addEventListener('click', handleRemoveTask);
        editTaskBtnEl.addEventListener('click', handleEditTask);
        taskInputEl.addEventListener('submit', (e) => {
            e.preventDefault();
            handleConfirmTask();
        });
        taskNameInputEl.addEventListener('click', () => {
            Popover.getInstance(taskNameInputEl)?.hide();
        });
        cancelTaskBtn.addEventListener('click', handleCancelTask);
        taskPriorityListEl.forEach((priority) => {
            priority.addEventListener(
                'click',
                handleSelectPriority.bind(null, priority),
            );
        });

        listsTogglerEl.addEventListener('click', handleToggleLists);
        navTogglerEl.addEventListener('click', handleToggleLists);

        const now = new Date(Date.now());
        taskDateInputEl.setAttribute(
            'min',
            `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
        );

        notificationProtoEl.remove();
        moveToProtoEl.remove();
        taskProtoEl.remove();
        listProtoEl.remove();
        taskInputEl.remove();
        listInputEl.remove();
        removeListBtnEl.remove();
        editListBtnEl.remove();
        removeTaskBtnEl.parentElement.remove();
        editTaskBtnEl.parentElement.remove();
        moveTaskBtnEl.parentElement.remove();
    }

    return {
        drawList,
        redrawList,
        eraseList,
        drawTask,
        eraseTask,
        redrawTask,
        drawNotification,
        eraseNotification,
        updateTaskCount,
        updateDueCount,
    };
}
