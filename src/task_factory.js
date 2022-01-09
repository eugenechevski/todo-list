/**
 * Task model API.
 *
 * @param {string} taskId
 * @param {string} taskName
 * @param {string} taskDate
 * @param {string} taskTime
 * @param {string} taskPriority
 * @param {boolean} isDue
 * @returns {object} task
 */
export default function (taskList, taskId, taskName, taskDate, taskTime, taskPriority, isDue) {
  function getList() {
    return taskList;
  }

  function setList(newList) {
    taskList = newList;
  }

  function getID() {
    return taskId;
  }

  function getName() {
    return taskName;
  }

  function setName(newName) {
    taskName = newName;
  }

  function getDate() {
    return taskDate;
  }

  function setDate(newDate) {
    taskDate = newDate;
  }

  function getTime() {
    return taskTime;
  }

  function setTime(newTime) {
    taskTime = newTime;
  }

  function getPriority() {
    return taskPriority;
  }

  function setPriority(newPriority) {
    taskPriority = newPriority;
  }

  function getDue() {
    return isDue;
  }

  function setDue(newIsDue) {
    isDue = newIsDue;
  }

  return {
    getList,
    setList,
    getID,
    getName,
    setName,
    getDate,
    setDate,
    getTime,
    setTime,
    getPriority,
    setPriority,
    getDue,
    setDue,
  };
}
