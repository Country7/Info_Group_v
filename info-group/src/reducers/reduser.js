const initialState = {
    sourcedata: {
        dateH: "",
		timeH: "",
		duration: ""
    },
    dateTimeH: null,
    today: null,
    durationH: null,
    sections: [],
    counteragents: [],
    documents: [],
    events: [],
    error: false,
    docs: [],
    docsAlert: 0,
    filtrTask: "Вид списка...",
    offsetTop: 0,
    offsetLeft: 0,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SOURCE_LOADED':
            const dateTimeStr = `${action.payload.dateH}T${action.payload.timeH}:00.000`,
                  dateTimeH = Date.parse(dateTimeStr),
                  today = new Date(),
                  durationH = parseDurationToMS(action.payload.duration);
            return {
                ...state,
                sourcedata: action.payload,
                dateTimeH: dateTimeH,
                durationH: durationH,
                today: today,
                error: false
            };
        //-----------------------------------------------------
        case 'DOCS_LOADED':
            return {
                ...state,
                docs: action.payload
            };
        //-----------------------------------------------------
        case 'DOCS_ALERT_LOADED':
            return {
                ...state,
                docsAlert: action.payload
            };
        //-----------------------------------------------------
        case 'SECTIONS_LOADED': 
            return {
                ...state,
                sections: action.payload,
                error: false
            };
        //-----------------------------------------------------
        case 'COUNTER_LOADED': 
            return {
                ...state,
                counteragents: action.payload,
                error: false
            };
        //-----------------------------------------------------
        case 'DOCUMENTS_LOADED': 
            return {
                ...state,
                documents: action.payload,
                error: false
            };
        //-----------------------------------------------------
        case 'EVENTS_LOADED': 
            return {
                ...state,
                events: action.payload,
                loading: false,
                error: false
            };
        //-----------------------------------------------------
        case 'FILTER_TASK': 
            return {
                ...state,
                filtrTask: action.payload,
            };
        //-----------------------------------------------------
        case 'SET_OFFSET_TOP': 
            return {
                ...state,
                offsetTop: action.payload,
            };
        //-----------------------------------------------------
        case 'SET_OFFSET_LEFT': 
            return {
                ...state,
                offsetLeft: action.payload,
            };

        //-----------------------------------------------------
        case 'ADD_DOC_TO_DOCUMENTS':
          const newDocA = action.payload,
                docIndexA = state.documents.findIndex(docA => docA.id === newDocA.id);
          if (docIndexA >= 0) {
            return {
              ...state, 
              documents: [
                ...state.documents.slice(0, docIndexA),
                newDocA,
                ...state.documents.slice(docIndexA + 1)
              ]}
          };
          return {
              ...state
          }; 
        //-----------------------------------------------------
        default: 
            return state;
    }
}

export default reducer;



function parseDurationToMS (duration) {
    let days = 0,
        hours = 0,
        mins = 0,
        durationH = null;
    if ((duration.length === 8) && (duration.includes('-', 2)) && (duration.includes(':', 5)) ) {
        days = +duration.slice(0,2);
        hours = +duration.slice(3,5);
        mins = +duration.slice(6,8);
        durationH = (days * 24  * 60 * 60 * 1000 ) + (hours * 60 * 60 * 1000) + (mins * 60 * 1000);
    }
    return durationH;
}

