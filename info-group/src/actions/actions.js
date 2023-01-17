const sourcedataLoaded = (newSourcedata) => {
  return {
    type: 'SOURCE_LOADED',
    payload: newSourcedata
  }
};
//-----------------------------------------------------
const sectionsLoaded = (newSections) => {
  return {
    type: 'SECTIONS_LOADED',
    payload: newSections
  }
};
//-----------------------------------------------------
const docsLoaded = (newDocs) => {
  return {
    type: 'DOCS_LOADED',
    payload: newDocs
  }
};
//-----------------------------------------------------
const docsAlertLoaded = (newDocsAlert) => {
  return {
    type: 'DOCS_ALERT_LOADED',
    payload: newDocsAlert
  }
};
//-----------------------------------------------------
const counteragentsLoaded = (newCounteragents) => {
  return {
    type: 'COUNTER_LOADED',
    payload: newCounteragents
  }
};
//-----------------------------------------------------
const documentsLoaded = (newDocuments) => {
  return {
    type: 'DOCUMENTS_LOADED',
    payload: newDocuments
  }
};
//-----------------------------------------------------
const eventsLoaded = (newEvents) => {
  return {
    type: 'EVENTS_LOADED',
    payload: newEvents
  }
}
//-----------------------------------------------------
const addDocToDocuments = (newDoc) => {
  return {
    type: 'ADD_DOC_TO_DOCUMENTS',
    payload: newDoc
  }
}
//-----------------------------------------------------
const setFilterTask = (newFilterTask) => {
  return {
    type: 'FILTER_TASK',
    payload: newFilterTask
  }
}
//-----------------------------------------------------
const setOffsetTop = (newOffsetTop) => {
  return {
    type: 'SET_OFFSET_TOP',
    payload: newOffsetTop
  }
}
//-----------------------------------------------------
const setOffsetLeft = (newOffsetLeft) => {
  return {
    type: 'SET_OFFSET_LEFT',
    payload: newOffsetLeft
  }
}
//-----------------------------------------------------

export { 
  sourcedataLoaded,
  sectionsLoaded,
  counteragentsLoaded,
  documentsLoaded,
  eventsLoaded,
  addDocToDocuments,
  docsLoaded,
  docsAlertLoaded,
  setFilterTask,
  setOffsetTop,
  setOffsetLeft
}
