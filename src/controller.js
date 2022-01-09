import { v4 as uuidv4 } from 'uuid';
import Task from './task_factory';
import List from './list_factory';
import renderer from './renderer';

/**
 * The module provides handling-API for the Renderer module and
 * facilitates the support of local storage.
 */
export default function () {
  let Renderer;
  let lists;

  /**
   * Checks whether the given task is overdue or not.
   *
   * @param task - task to be checked
   * @returns {boolean}
   */
  function isDue(task) {
    const givenDate = task.getDate();
    const givenTime = task.getTime();

    const timeStamp = new Date();
    const hourShift = givenTime[0] < 12 && givenTime[2] === 'PM' ? 12 : 0;

    timeStamp.setFullYear(
      Number(givenDate[2]),
      Number(givenDate[0]) - 1,
      Number(givenDate[1]),
    );
    timeStamp.setHours(hourShift + Number(givenTime[0]), Number(givenTime[1]));

    return timeStamp <= new Date(Date.now());
  }

  /**
   * Checks if there's a list that has given credentials
   */
  function hasSameList(listName, listIcon) {
    let result = false;
    const listArr = Object.values(lists);

    for (let i = 0; i < listArr.length; i += 1) {
      if (
        listArr[i].getName() === listName
        && listArr[i].getIcon() === listIcon
      ) {
        result = true;
        break;
      }
    }

    return result;
  }

  /**
   * Updates the 'localStorage' object.
   *
   * @param update - update to be performed
   */
  function updateStorage(update) {
    const storage = JSON.parse(localStorage.getItem('listStorage')) ?? {};
    const evalSwitch = {
      'list.add': () => {
        storage[update.list.getID()] = {
          name: update.list.getName(),
          icon: update.list.getIcon(),
          tasks: {},
        };
      },
      'list.remove': () => {
        delete storage[update.list_id];
      },
      'list.edit': () => {
        storage[update.list.getID()].name = update.list.getName();
        storage[update.list.getID()].icon = update.list.getIcon();
      },
      'task.add_or_edit': () => {
        storage[update.list_id].tasks[update.task.getID()] = {
          name: update.task.getName(),
          date: update.task.getDate(),
          time: update.task.getTime(),
          priority: update.task.getPriority(),
          is_due: update.task.getDue(),
        };
      },
      'task.remove': () => {
        delete storage[update.list_id].tasks[update.task_id];
      },
      'task.move': () => {
        const taskCopy = {
          ...storage[update.old_list_id].tasks[update.task_id],
        };
        delete storage[update.old_list_id].tasks[update.task_id];
        storage[update.new_list_id].tasks[update.task_id] = taskCopy;
      },
    };

    evalSwitch[update.type]();
    localStorage.setItem('listStorage', JSON.stringify(storage));
  }

  /**
   * Deserializes data from 'localStorage'.
   *
   * @returns revivedStorage - deserialized storage
   */
  function reviveStorage() {
    const revivedStorage = {};
    const jsonStorage = JSON.parse(localStorage.getItem('listStorage'));
    let revivedList;
    let revivedTask;

    Object.keys(jsonStorage).forEach((listID) => {
      revivedList = List(
        listID,
        jsonStorage[listID].name,
        jsonStorage[listID].icon,
      );

      Object.keys(jsonStorage[listID].tasks).forEach((taskID) => {
        revivedTask = Task(
          revivedList,
          taskID,
          jsonStorage[listID].tasks[taskID].name,
          jsonStorage[listID].tasks[taskID].date,
          jsonStorage[listID].tasks[taskID].time,
          jsonStorage[listID].tasks[taskID].priority,
          jsonStorage[listID].tasks[taskID].is_due,
        );

        revivedList.appendTask(revivedTask);
      });

      revivedStorage[listID] = revivedList;
    });

    return revivedStorage;
  }

  /**
   * Handles a list-selection.
   *
   * @param current_list_id - currently displayed list
   * @param selectedListId - list to be rendered
   * @param displayedTasks - tasks that are currently displayed
   */
  function listView(selectedListId, displayedTasks) {
    let tasks;
    let task;

    // Erase all displayed tasks
    if (displayedTasks) {
      Object.keys(displayedTasks).forEach((taskID) => {
        task = lists[displayedTasks[taskID]].getTask(taskID);

        Renderer.eraseTask(taskID);
        if (task.getDue()) {
          Renderer.updateDueCount(-1);
        }
      });
    }

    // Render all the tasks
    const drawCode = () => {
      Object.keys(tasks).forEach((taskID) => {
        task = tasks[taskID];

        if (isDue(task)) {
          Renderer.drawNotification(task);
          Renderer.updateDueCount(+1);

          task.setDue(true);
          updateStorage({
            type: 'task.add_or_edit',
            list_id: task.getList().getID(),
            task,
          });
        }

        Renderer.drawTask(task);
      });
    };

    if (selectedListId === 'homeList') {
      Object.keys(lists).forEach((listID) => {
        tasks = lists[listID].getAllTasks();
        drawCode();
      });
    } else {
      tasks = lists[selectedListId].getAllTasks();
      drawCode();
    }
  }

  /**
   * Handles searching of displayed tasks of a given list.
   *
   * @param givenListId - id of a list where to search for tasks
   * @param searchTerm - token that describes tasks
   * @param displayedTasks - currently displayed tasks
   */
  function searchView(givenListId, searchTerm, displayedTasks) {
    let matchedTasks;

    // Obtain matched tasks
    if (givenListId === 'homeList') {
      matchedTasks = {};
      Object.keys(lists).forEach((listID) => {
        matchedTasks = Object.assign(
          matchedTasks,
          lists[listID].searchTasks(searchTerm),
        );
      });
    } else {
      matchedTasks = lists[givenListId].searchTasks(searchTerm);
    }

    // Erase tasks which are displayed
    let task;
    Object.keys(displayedTasks).forEach((taskID) => {
      task = lists[displayedTasks[taskID]].getTask(taskID);
      Renderer.eraseTask(taskID);

      if (task.getDue()) {
        Renderer.updateDueCount(-1);
      }
    });

    // Draw tasks matched tasks
    Object.keys(matchedTasks).forEach((taskID) => {
      task = matchedTasks[taskID];
      Renderer.drawTask(task);

      if (task.getDue()) {
        Renderer.updateDueCount(+1);
      }
    });
  }

  /**
   * Handles creation of a new list.
   *
   * @param listData - data associated with a new list
   */
  function addList(listData) {
    const listName = listData.name;
    const listIcon = listData.icon;

    // Validate
    if (hasSameList(listName, listIcon)) {
      return false;
    }

    // Create a list object
    const newList = List(uuidv4(), listName, listIcon);
    lists[newList.getID()] = newList;

    updateStorage({
      type: 'list.add',
      list: newList,
    });
    Renderer.drawList(newList);

    return true;
  }

  /**
   * Handles removal of a list.
   *
   * @param givenListId - id of a list to be removed
   */
  function removeList(givenListId) {
    // Update the display
    Renderer.eraseList(givenListId);
    Renderer.updateTaskCount(
      'homeList',
      -Object.values(lists[givenListId].getAllTasks()).length,
    );
    Object.keys(lists[givenListId].getAllTasks()).forEach((taskID) => {
      Renderer.eraseTask(taskID);
      if (lists[givenListId].getTask(taskID).getDue()) {
        Renderer.updateDueCount(-1);
        Renderer.eraseNotification(taskID);
      }
    });

    // Update the model
    delete lists[givenListId];
    updateStorage({
      type: 'list.remove',
      list_id: givenListId,
    });
  }

  /**
   * Handles modifications of a given list.
   *
   * @param givenListId - id a list to be modified
   * @param updatedList - data of the list to be modified
   */
  function editList(givenListId, updatedList) {
    const newName = updatedList.name;
    const newIcon = updatedList.icon;

    // Check if the user didn't modify anything
    if (
      lists[givenListId].getName() === newName
      && lists[givenListId].getIcon() === newIcon
    ) {
      return true;
    }

    // Validate
    if (hasSameList(newName, newIcon)) {
      return false;
    }

    lists[givenListId].setName(newName);
    lists[givenListId].setIcon(newIcon);

    updateStorage({
      type: 'list.edit',
      list: lists[givenListId],
    });
    Renderer.redrawList(lists[givenListId]);

    return true;
  }

  /**
   * Handles creation of a new task.
   *
   * @param listId - id of the task's list
   * @param taskData - data of the new task
   */
  function addTask(listId, taskData) {
    const taskID = uuidv4();
    const taskName = taskData.name;
    const taskDate = taskData.date;
    const taskTime = taskData.time;
    const taskPriority = taskData.priority;
    const newTask = Task(
      lists[listId],
      taskID,
      taskName,
      taskDate,
      taskTime,
      taskPriority,
      false,
    );

    lists[listId].appendTask(newTask);

    updateStorage({
      type: 'task.add_or_edit',
      list_id: listId,
      task: newTask,
    });
    Renderer.drawTask(newTask);
    Renderer.updateTaskCount(listId, +1);
    if (listId !== 'homeList') {
      Renderer.updateTaskCount('homeList', +1);
    }
  }

  /**
   * Handles removal of a task.
   *
   * @param listId - id of the task's list
   * @param taskId - task's id
   */
  function removeTask(listId, taskId) {
    const list = lists[listId];
    const task = list.getTask(taskId);

    // Remove it

    Renderer.eraseTask(taskId);
    Renderer.updateTaskCount(list.getID(), -1);
    if (listId !== 'homeList') {
      Renderer.updateTaskCount('homeList', -1);
    }

    if (task.getDue()) {
      Renderer.eraseNotification(taskId);
      Renderer.updateDueCount(-1);
    }

    list.popTask(taskId);
    updateStorage({
      type: 'task.remove',
      list_id: list.getID(),
      task_id: taskId,
    });
  }

  /**
   * Handles modification of a task.
   *
   * @param listId - id of the task's list
   * @param taskId - id of the task
   * @param updatedTask - modified data of the task
   */
  function editTask(listId, taskId, updatedTask) {
    const list = lists[listId];
    const targetTask = list.getTask(taskId);

    // Remove the task's due indicators
    if (targetTask.getDue()) {
      Renderer.eraseNotification(taskId);
      Renderer.updateDueCount(-1);
    }

    // Update it

    const newName = updatedTask.name;
    const newDate = updatedTask.date;
    const newTime = updatedTask.time;
    const newPriority = updatedTask.priority;

    targetTask.setName(newName);
    targetTask.setDate(newDate);
    targetTask.setTime(newTime);
    targetTask.setPriority(newPriority);
    targetTask.setDue(false);

    updateStorage({
      type: 'task.add_or_edit',
      list_id: list.getID(),
      task: targetTask,
    });

    Renderer.redrawTask(targetTask);
  }

  /**
   * Handles moving of a task from a list to another list.
   *
   * @param oldListId - id of a list the task is currently in
   * @param newListId - id of a list where task needs to be moved to
   * @param taskId - id of the task
   */
  function moveTask(oldListId, newListId, taskId, redraw) {
    const oldList = lists[oldListId];
    const targetTask = oldList.getTask(taskId);

    // Copy before removal
    const movedTask = { ...targetTask };
    movedTask.setList(lists[newListId]);

    // Update the display

    if (redraw) {
      Renderer.redrawTask(movedTask);
    } else {
      Renderer.eraseTask(taskId);
    }

    // Update the task's indicators

    if (targetTask.getDue()) {
      Renderer.eraseNotification(taskId);
      Renderer.drawNotification(targetTask);
      if (!redraw) {
        Renderer.updateDueCount(-1);
      }
    }
    if (oldListId !== 'homeList') {
      Renderer.updateTaskCount(oldListId, -1);
    }
    if (newListId !== 'homeList') {
      Renderer.updateTaskCount(newListId, +1);
    }

    // Update the model

    lists[oldListId].popTask(taskId);
    lists[newListId].appendTask(movedTask);

    updateStorage({
      type: 'task.move',
      old_list_id: oldList.getID(),
      new_list_id: newListId,
      task_id: taskId,
    });
  }

  /**
   * Handles sorting of tasks.
   *
   * @param criteria - specifies how to sort tasks
   * @param list_id - id of currently selected list
   * @param givenTaskIDs - ids of displayed tasks
   */
  function sortTasks(criteria, givenTaskIDs) {
    const sorted = [];

    // Obtain task objects
    Object.keys(givenTaskIDs).forEach((taskID) => {
      sorted.push(lists[givenTaskIDs[taskID]].getTask(taskID));
    });
    // Define sorting
    let compareFn;
    if (criteria === 'Name') {
      compareFn = (task1, task2) => {
        const name1 = task1.getName().toUpperCase();
        const name2 = task2.getName().toUpperCase();
        let result = 0;

        if (name1 < name2) {
          result = -1;
        } else if (name1 > name2) {
          result = 1;
        }

        return result;
      };
    } else if (criteria === 'Date') {
      compareFn = (task1, task2) => {
        const date1 = new Date();
        const givenDate1 = task1.getDate();
        date1.setFullYear(
          Number(givenDate1[2]),
          Number(givenDate1[0]) - 1,
          Number(givenDate1[1]),
        );

        const date2 = new Date();
        const givenDate2 = task2.getDate();
        date1.setFullYear(
          Number(givenDate2[2]),
          Number(givenDate2[0]) - 1,
          Number(givenDate2[1]),
        );

        // eslint-disable-next-line no-nested-ternary
        return date1 < date2 ? -1 : date1 === date2 ? 0 : 1;
      };
    } else if (criteria === 'Time') {
      compareFn = (task1, task2) => {
        const time1 = new Date();
        const givenTime1 = task1.getTime();
        const givenHours1 = givenTime1[0] < 12 && givenTime1[2] === 'PM'
          ? 12 + Number(givenTime1[0])
          : Number(givenTime1[0]);
        const givenMinutes1 = Number(givenTime1[1]);

        time1.setHours(givenHours1, givenMinutes1);

        const time2 = new Date();
        const givenTime2 = task2.getTime();
        const givenHours2 = givenTime2[0] < 12 && givenTime2[2] === 'PM'
          ? 12 + Number(givenTime2[0])
          : Number(givenTime2[0]);
        const givenMinutes2 = Number(givenTime2[1]);

        time2.setHours(givenHours2, givenMinutes2);

        // eslint-disable-next-line no-nested-ternary
        return time1 < time2 ? -1 : time1 === time2 ? 0 : 1;
      };
    } else if (criteria === 'Priority') {
      compareFn = (task1, task2) => {
        let priority1 = task1.getPriority();
        priority1 = priority1.slice(0, priority1.indexOf(' '));

        let priority2 = task2.getPriority();
        priority2 = priority2.slice(0, priority2.indexOf(' '));

        let result = 0;
        if (
          (priority1 === 'High'
            && (priority2 === 'Medium' || priority2 === 'Low'))
          || (priority1 === 'Medium' && priority2 === 'Low')
        ) {
          result = 1;
        } else if (
          (priority2 === 'High'
            && (priority1 === 'Medium' || priority1 === 'Low'))
          || (priority2 === 'Medium' && priority1 === 'Low')
        ) {
          result = -1;
        }

        return result;
      };
    }

    // Sort
    sorted.sort(compareFn);

    // Erase displayed non-sorted tasks
    sorted.forEach((task) => Renderer.eraseTask(task.getID()));

    // Draw sorted tasks
    sorted.forEach((task) => Renderer.drawTask(task));
  }

  /**
   * Initialization code.
   */
  function init() {
    Renderer = renderer(this);

    if (Object.keys(localStorage).includes('listStorage')) {
      lists = reviveStorage();

      let currentCount = 0;
      let totalCount = 0;
      // Draw the lists

      Object.keys(lists).forEach((listID) => {
        currentCount = Object.values(lists[listID].getAllTasks()).length;
        if (listID !== 'homeList') {
          Renderer.drawList(lists[listID]);
          Renderer.updateTaskCount(listID, currentCount);
        }

        totalCount += currentCount;
      });

      // Render the 'Home' list
      Renderer.updateTaskCount('homeList', totalCount);
      listView('homeList');
    } else {
      lists = {};
      lists.homeList = List('homeList', 'Home', '🏠️');

      updateStorage({
        type: 'list.add',
        list: lists.homeList,
      });
    }
  }

  return {
    init,
    listView,
    searchView,
    addList,
    removeList,
    editList,
    addTask,
    removeTask,
    editTask,
    moveTask,
    sortTasks,
  };
}
