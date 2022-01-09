/**
 * List model API.
 *
 * @param {string} listId
 * @param {string} listName
 * @param {string} listIcon
 * @returns {object} list
 */
export default function (listId, listName, listIcon) {
  const tasks = {};

  function getID() {
    return listId;
  }

  function getName() {
    return listName;
  }

  function setName(newName) {
    listName = newName;
  }

  function getIcon() {
    return listIcon;
  }

  function setIcon(newIcon) {
    listIcon = newIcon;
  }

  function getTask(taskId) {
    return tasks[taskId];
  }

  function getAllTasks() {
    return tasks;
  }

  function searchTasks(pattern) {
    if (pattern === /./) {
      return tasks;
    }

    const matched = {};
    const regex = new RegExp(pattern, 'i');
    let taskName;
    Object.keys(tasks).forEach((taskID) => {
        taskName = tasks[taskID].getName();
        if (taskName.match(regex) != null) {
          matched[taskID] = tasks[taskID];
        }
    });

    return matched;
  }

  function appendTask(task) {
    tasks[task.getID()] = task;
  }

  function popTask(taskId) {
    delete tasks[taskId];
  }

  return {
    getID,
    getName,
    setName,
    getIcon,
    setIcon,
    getTask,
    getAllTasks,
    searchTasks,
    appendTask,
    popTask,
  };
}
