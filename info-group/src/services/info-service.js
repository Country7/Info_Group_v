export default class InfoService{
  // _apiBase = 'http://192.168.38.129:3004';
  _apiBase = 'http://localhost:3004';


  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` + 
            `, received ${res.status}`);
    }
    return await res.json();
  }

  async getSourcedata () {
    return await this.getResource('/sourcedata');
  }
  async getSections () {
    return await this.getResource('/sections');
  }
  async getCounteragents () {
    return await this.getResource('/counteragents');
  }
  async getDocuments () {
    return await this.getResource('/documents?_sort=id&_order=asc');
  }
  async getEvents () {
    return await this.getResource('/events');
  }

  //-----------------------------------------------------------
  // POST API
  //-----------------------------------------------------------
    
  async patchDoc (doc) {
    console.log(`info-service - patchDoc ${doc.id}, ${doc.everydayCurrentPeriod}, ${doc.end}`);
    const response = await fetch(`${this._apiBase}/documents/${doc.id}`, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(doc)
    });
    if (!response.ok){
      throw new Error('json error'); 
    }
  }

  //-----------------------------------------------------------

  async patchDocsReceivedTimeExecuted (docAvailable, ctragtId, execIn) {
      
    const ctragtIndex = docAvailable.receivedTime.findIndex( ctragt => ctragt.ctragtId === ctragtId ), 
          ctragtInDoc = docAvailable.receivedTime.find( ctragt => ctragt.ctragtId === ctragtId );

    const execIndex = ctragtInDoc.executed.findIndex( exec => exec.period == execIn.period);
    let newExecuted = ctragtInDoc.executed;
    if (execIndex == -1) { 
      newExecuted.push(execIn); 
    } else { 
      newExecuted = ctragtInDoc.executed.map( exec => {
        if (exec.period == execIn.period) {
          return execIn;
        } else {
          return exec;
        }
      });
    }
    
console.log(`patchDocsReceivedTimeExecuted -------- newExecuted = ${newExecuted}`);
    const newCtragt = { ...ctragtInDoc, executed: newExecuted },
          newAllCtragts =  [
            ...docAvailable.receivedTime.slice(0, ctragtIndex),
            newCtragt,
            ...docAvailable.receivedTime.slice(ctragtIndex + 1),
            ],
          newDoc = {
            ...docAvailable,
            receivedTime: newAllCtragts
          };

    const response = await fetch(`${this._apiBase}/documents/${newDoc.id}`, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(newDoc)
    });
    if (!response.ok){
      throw new Error('json error'); 
    }
  }

  //-----------------------------------------------------------

  async patchDocsDeliveryTimeExecuted (docAvailable, ctragtId, execIn) {
        
    const ctragtIndex = docAvailable.deliveryTime.findIndex( ctragt => ctragt.ctragtId === ctragtId ), 
          ctragtInDoc = docAvailable.deliveryTime.find( ctragt => ctragt.ctragtId === ctragtId );

    const execIndex = ctragtInDoc.executed.findIndex( exec => exec.period == execIn.period);
    let newExecuted = ctragtInDoc.executed;
    if (execIndex == -1) { 
      newExecuted.push(execIn); 
    } else {
      newExecuted = ctragtInDoc.executed.map( exec => {
        if (exec.period == execIn.period) {
          return execIn;
        } else {
          return exec;
        }
      });
    }
    
    const newCtragt = { ...ctragtInDoc, executed: newExecuted },
          newAllCtragts =  [
            ...docAvailable.deliveryTime.slice(0, ctragtIndex),
            newCtragt,
            ...docAvailable.deliveryTime.slice(ctragtIndex + 1),
            ],
          newDoc = {
            ...docAvailable,
            deliveryTime: newAllCtragts
          };

    const response = await fetch(`${this._apiBase}/documents/${newDoc.id}`, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(newDoc)
    });
    if (!response.ok){
        throw new Error('json error'); 
    }
  }

  //-----------------------------------------------------------
  //-----------------------------------------------------------
 
    async patchSourcedata (sourcedata) {
console.log(`info-service - patchSourcedata ${sourcedata.dateH}, ${sourcedata.timeH}, ${sourcedata.duration}`);
        const response = await fetch(`${this._apiBase}/sourcedata`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(sourcedata)
        });
        if (!response.ok){
            throw new Error('json error'); 
        }
    }

    //-----------------------------------------------------------
    // For form everydayCurrentPeriod
    //-----------------------------------------------------------

    dateTimeToStrDate = (dateTimeAstro) => {
      const newDate = new Date(dateTimeAstro),
            year = newDate.getFullYear(),
            month = newDate.getMonth() + 1,
            day = newDate.getDate(),
            hour = newDate.getHours(),
            min = newDate.getMinutes(),
            timeloc = [( hour > 9 ? '' : '0' ) + hour, ( min > 9 ? '' : '0' ) + min ].join(':'),
            dateloc = [year, ( month > 9 ? '' : '0' ) + month, ( day > 9 ? '' : '0' ) + day].join('-'),
            dateStr = `${dateloc}T${timeloc}`;
      return dateStr;
    }

    //-----------------------------------------------------------

    updateEverydayCurrentPeriod = (docs) => {
      //-----------------------------------------------------------
      // In: docs 
      // Out: newDocs - 
      //      { ...doc, everydayCurrentPeriod }
      //-----------------------------------------------------------
      const today = new Date();

      const newDocs = docs.map( doc => {
				let everydayCurrentPeriod = null;

        if ((doc.end == "") && (doc.everydayTimePresents != "")) {
          let arrEverydayTPMs = [],
              arrEverydayTPAstro = [],
              arrEverydayTPStrDate = [];

          doc.everydayTimePresents.forEach( (everydayTP, indx) => {
            const everydayTPMs = this.parseTimeStrToMs( everydayTP ), 
                  everydayTPAstro = this.getDateDocPlanMS( this.parseTodayToZeroTime(), everydayTPMs), 
                  everydayTPStrDate = this.dateTimeToStrDate(everydayTPAstro); 

            arrEverydayTPMs.push(everydayTPMs);
            arrEverydayTPAstro.push(everydayTPAstro);
            arrEverydayTPStrDate.push(everydayTPStrDate);

            if (( indx === 0 ) && ( today < everydayTPAstro )) {
              const prevEverydayTPMs = this.parseTimeStrToMs( doc.everydayTimePresents[ doc.everydayTimePresents.length - 1 ] ),
                    prevEverydayTPAstro = this.getDateDocPlanMS( this.parseYesterdayToZeroTime(), prevEverydayTPMs),
                    prevEverydayTPStrDate = this.dateTimeToStrDate(prevEverydayTPAstro); 

              everydayCurrentPeriod = `${prevEverydayTPStrDate}=${everydayTPStrDate}`;

            } else if (( today < everydayTPAstro ) && ( today > arrEverydayTPAstro[indx-1] )) {
							everydayCurrentPeriod = `${arrEverydayTPStrDate[indx-1]}=${everydayTPStrDate}`;

            } else if (( indx === doc.everydayTimePresents.length - 1 ) && ( today > everydayTPAstro )) {
							const tomorrowEverydayTPAstro = this.getDateDocPlanMS( this.parseTomorrowToZeroTime(), arrEverydayTPMs[0] ),
										tomorrowEverydayTPStrDate = this.dateTimeToStrDate( tomorrowEverydayTPAstro );
							everydayCurrentPeriod = `${everydayTPStrDate}=${tomorrowEverydayTPStrDate}`;
						}
					}); 

          if ( doc.everydayCurrentPeriod != everydayCurrentPeriod) {
            this.patchDoc({ ...doc, everydayCurrentPeriod: everydayCurrentPeriod });
          }

          const receivedT = doc.receivedTime.map( ctragt => {
            if ( everydayCurrentPeriod !== null ) {

              if ( ((ctragt.executed == "") || (ctragt.executed == null)) || 
                    (ctragt.executed[ ctragt.executed.length -1 ].period !== everydayCurrentPeriod) ) {
                const execIn = {
                  period: everydayCurrentPeriod,
                  time: ""
                };
                this.patchDocsReceivedTimeExecuted(doc, ctragt.ctragtId, execIn);
              } 
            }
            return ctragt;
          }); 
          doc.receivedTime = receivedT;

          const deliveryT = doc.deliveryTime.map( ctragt => {
            if ( everydayCurrentPeriod !== null ) {

              if ( ((ctragt.executed == "") || (ctragt.executed == null)) || 
                    (ctragt.executed[ ctragt.executed.length -1 ].period !== everydayCurrentPeriod) ) {
                const execIn = {
                  period: everydayCurrentPeriod,
                  time: ""
                };
                this.patchDocsDeliveryTimeExecuted(doc, ctragt.ctragtId, execIn);
              } 
            }
            return ctragt;
          }); 
          doc.deliveryTime = deliveryT;

        }; 

				return { ...doc, everydayCurrentPeriod };
      }); 

			return newDocs;
    }

    //-----------------------------------------------------------

    updateAstroDateTime = (docs, dateTimeH) => {
      //-----------------------------------------------------------
      // In: docs - 
      // Out: newDocs - 
      //     {...doc, 
      //     tdTimeAliasH,
      //     tdTimeAstroH,
      //     tdTimeAstroHTime,
      //     tdTimeAstroHDate  }
      //-----------------------------------------------------------
      const newDocs = docs.map( doc => {
        let tdTimeAliasH = "";   
        if (doc.end !== "") {
          tdTimeAliasH = `к "С"+ ${ doc.end }`;
        } else {
          doc.everydayTimePresents.forEach( ( evrTP, indx ) => {
            tdTimeAliasH = ( indx !== doc.everydayTimePresents.length - 1 ) ? tdTimeAliasH + `к ${evrTP}, ` : tdTimeAliasH + `к ${evrTP}`;
          })
        }
        
        let tdTimeAstroH = 'астр. ';
        let tdTimeAstroHTime = '';
        let tdTimeAstroHDate = '';
        const docEndMs = this.parseTimeStrToMs(doc.end);

        if (docEndMs !== 0) { 
          const { timeTdDocPlan, dateTdDocPlan } = this.getTimeTdDocPlan(dateTimeH, docEndMs);
          tdTimeAstroH += timeTdDocPlan;
          tdTimeAstroHTime = timeTdDocPlan;
          tdTimeAstroHDate = dateTdDocPlan;

        } else if (doc.everydayCurrentPeriod != "") { 
          const { remadedTime, remadedDate } = this.getRemadedDateTime( doc.everydayCurrentPeriod.split('=')[1]);
          tdTimeAstroH += remadedTime;
          tdTimeAstroHTime = remadedTime;
          tdTimeAstroHDate = remadedDate;

        }
        return {...doc, 
                tdTimeAliasH,
                tdTimeAstroH,
                tdTimeAstroHTime,
                tdTimeAstroHDate
                };
      });
      return newDocs;
    }

    //-----------------------------------------------------------

    updateStyleReceivedAndDelivery = (docs, dateTimeH) => {
      //-----------------------------------------------------------
      // In: docs - 
      // Out: newDocs - 
      //      {...doc,
      //      receivedTime: updatedReceivedTime,
      //      deliveryTime: updatedDeliveryTime
      //      status: 'executed', 'with-delay', 'expired', 'is-execution', "other" }
      //    newCtragt = {...ctragt, 
      //      checkPlan,
      //      received: ctragt.executed[ ctragt.executed.length -1 ].time}
      //    newCtragt = {...ctragt, 
      //      checkPlan,
      //      delivery: ctragt.executed[ ctragt.executed.length -1 ].time};
      //-----------------------------------------------------------

      const newDocs = docs.map( doc => {
        let executed = 0,
            withDelay = 0,
            expired = 0,
            isExecution = 0;
        const docEndMs = this.parseTimeStrToMs(doc.end),
              docStartMs = this.parseTimeStrToMs(doc.start);

        
        const updatedReceivedTime = doc.receivedTime.map( ctragt => {
          let newCtragt = { ...ctragt, checkPlan: "" };

          if ((docEndMs !== 0) && (ctragt.received != "")) {
              const docDateTimeMS = this.parseDateTimeStrToMS(ctragt.received), 
                    dateDocPlanMS = this.getDateDocPlanMS(dateTimeH, docEndMs),
                    checkPlan = (docDateTimeMS < dateDocPlanMS) ? "table-success" : "table-danger";
              if (checkPlan === "table-danger") { withDelay++ };
              if (checkPlan === "table-success") { executed++ }; 
              newCtragt = {...ctragt, checkPlan};
            
          } else if ((docEndMs == 0) && (doc.everydayCurrentPeriod != "")) {
            
            if ( ctragt.executed[ ctragt.executed.length -1 ].period == doc.everydayCurrentPeriod) {
              if (ctragt.executed[ ctragt.executed.length -1 ].time != "") { 
                const timeMs = this.parseDateTimeStrToMS( ctragt.executed[ ctragt.executed.length -1 ].time ),
                      startMs = this.parseDateTimeStrToMS( doc.everydayCurrentPeriod.split('=')[0] ),
                      endMs = this.parseDateTimeStrToMS( doc.everydayCurrentPeriod.split('=')[1] );
                const checkPlan = ((startMs < timeMs) && (timeMs < endMs)) ? "table-success" : "table-danger";
                if (checkPlan === "table-danger") { withDelay++ }; 
                if (checkPlan === "table-success") { executed++ }; 
                newCtragt = {...ctragt, 
                                checkPlan,
                                received: ctragt.executed[ ctragt.executed.length -1 ].time};
              } else {
                isExecution++ 
              }
            }
          }

          if ((docEndMs !== 0) && (ctragt.received == "")) {
            if ( ( +this.getDateDocPlanMS(dateTimeH, docStartMs) < +Date.now()) && 
                  ( +Date.now() < +this.getDateDocPlanMS(dateTimeH, docEndMs)) ) { 
              isExecution++ 
            }
            if ( +Date.now() > +this.getDateDocPlanMS(dateTimeH, docEndMs) ) {
              expired++ 
            }
          } 
          return newCtragt;
        }); 


        const updatedDeliveryTime = doc.deliveryTime.map( ctragt => {
          let newCtragt = { ...ctragt, checkPlan: "" };

          if ((docEndMs !== 0) && (ctragt.delivery != "")) {
              const docDateTimeMS = this.parseDateTimeStrToMS(ctragt.delivery), 
                    dateDocPlanMS = this.getDateDocPlanMS(dateTimeH, docEndMs),
                    checkPlan = (docDateTimeMS < dateDocPlanMS) ? "table-success" : "table-danger";
              if (checkPlan === "table-danger") { withDelay++ };
              if (checkPlan === "table-success") { executed++ };
              newCtragt = {...ctragt, checkPlan};
            
          } else if ((docEndMs == 0) && (doc.everydayCurrentPeriod != "")) {
             
            if ( ctragt.executed[ ctragt.executed.length -1 ].period == doc.everydayCurrentPeriod) {
              if (ctragt.executed[ ctragt.executed.length -1 ].time != "") { 
                const timeMs = this.parseDateTimeStrToMS( ctragt.executed[ ctragt.executed.length -1 ].time ),
                      startMs = this.parseDateTimeStrToMS( doc.everydayCurrentPeriod.split('=')[0] ),
                      endMs = this.parseDateTimeStrToMS( doc.everydayCurrentPeriod.split('=')[1] );
                const checkPlan = ((startMs < timeMs) && (timeMs < endMs)) ? "table-success" : "table-danger";
                if (checkPlan === "table-danger") { withDelay++ };
                if (checkPlan === "table-success") { executed++ }; 
                newCtragt = {...ctragt, 
                                checkPlan,
                                delivery: ctragt.executed[ ctragt.executed.length -1 ].time};
              } else {
                isExecution++ 
              }
            }
          }

          if ((docEndMs !== 0) && (ctragt.delivery == "")) {
            if ( ( +this.getDateDocPlanMS(dateTimeH, docStartMs) < +Date.now()) && 
                  ( +Date.now() < +this.getDateDocPlanMS(dateTimeH, docEndMs)) ) { 
              isExecution++
            }
            if ( +Date.now() > +this.getDateDocPlanMS(dateTimeH, docEndMs) ) {
              expired++ 
            }
          } 

          return newCtragt;
        }); 

        let status = "";
        if ( expired > 0 ) { status = "expired" }
        else if ( isExecution > 0 ) { status = "is-execution" }
        else if ( withDelay > 0 ) { status = "with-delay" }
        else if ( executed > 0 ) { status = "executed" }
        else { status = "other" };

        return {...doc,
                receivedTime: updatedReceivedTime,
                deliveryTime: updatedDeliveryTime,
                status: status};
      });
      return newDocs;
    }

    //-----------------------------------------------------------
    
    updateDocsProgress = (docs_EvCurPer_Astro_Style, dateTimeH) => {
    
      const docsProgress = docs_EvCurPer_Astro_Style.map( doc => {

        const { progressWidth, remainedStr, checked } = this.getProgrDocValue(doc, dateTimeH); 
        
        let fraction = "-/-";
        if (progressWidth < 50) { fraction = "1/4"; }
        else if (progressWidth < 75 ) { fraction = "2/4"; }
        else if (progressWidth < 100 ) { fraction = "3/4"; }
        else { fraction = "4/4"; }

        let klass = 'bg-info';
        if (progressWidth < 70) {
            klass = 'bg-info'
        } else if (progressWidth > 85) {
            klass = 'bg-danger'
        } else {
            klass = 'bg-warning'
        }
        klass = (checked) ? 'bg-success' : klass;
        klass = (doc.status === 'with-delay') ? 'bg-warning' : klass;

        const newDoc = { ...doc, progressWidth, remainedStr, checked, fraction, klass }
        return newDoc;
      })
      return docsProgress;
    }
    
    //-----------------------------------------------------------

    getAvailablePeriods = (docs, docId, received, ctragtId) => {
      const doc = docs.find( doc => doc.id === docId );
      let ctragts = [];
      if (received) {
        ctragts = doc.receivedTime;
      } else {
        ctragts = doc.deliveryTime;
      }
      const ctragt = ctragts.find( ctragt => ctragt.ctragtId === ctragtId);
      const availableExecuted = ctragt.executed;

      return availableExecuted;
    };
    
    //-----------------------------------------------------------
    // For Check Execution Document
    //-----------------------------------------------------------

    checkExecDoc = (doc) => {
        let check = true;
        if (doc.receivedTime == "") {
            check = false;
        } else {
          doc.receivedTime.forEach( ctragt => {
            if (ctragt.received == "") {
              check = false;
            } 
          });
        }
        if (doc.deliveryTime == "") {
            check = false;
        } else {
          doc.deliveryTime.forEach( deliveryTime => {
            if (deliveryTime.delivery == "") {
                check = false;
            } 
          });
        }
        return check;
    }

    //-----------------------------------------------------------
    // For StatTable
    //-----------------------------------------------------------

    parseTodayToZeroTime = () => {
      const today = new Date(),
            year = today.getFullYear(),
            month = today.getMonth(),
            day = today.getDate(),
            todayZeroTime = new Date(year, month, day);
      return todayZeroTime;
    }

    //-----------------------------------------------------------
    
    parseTomorrowToZeroTime = () => {
      const today = new Date(),
            tomorrow = new Date( +( today ) + (24 * 60 * 60 * 1000) ),
            year = tomorrow.getFullYear(),
            month = tomorrow.getMonth(),
            day = tomorrow.getDate(),
            tomorrowZeroTime = new Date(year, month, day);
      return tomorrowZeroTime;
    }

    //-----------------------------------------------------------
    
    parseYesterdayToZeroTime = () => {
      const today = new Date(),
            yesterday = new Date( +( today ) - (24 * 60 * 60 * 1000) ),
            year = yesterday.getFullYear(),
            month = yesterday.getMonth(),
            day = yesterday.getDate(),
            yesterdayZeroTime = new Date(year, month, day);
      return yesterdayZeroTime;
    }

    //-----------------------------------------------------------

    getTimeTdDocPlan = ( dateTimeH, docEndMs ) => {
        //-----------------------------------------------------------
        // In: dateTimeH -
        //     docEndMs - 
        // Out: timeTdDocPlan - 
        //      dateTdDocPlan - 
        //-----------------------------------------------------------
        const dateTimeDocEnd = new Date(+dateTimeH + +docEndMs), 
              year = dateTimeDocEnd.getFullYear(),
              month = dateTimeDocEnd.getMonth() + 1,
              day = dateTimeDocEnd.getDate(),
              hour = dateTimeDocEnd.getHours(),
              min = dateTimeDocEnd.getMinutes(),
              timeTdDocPlan = [( hour > 9 ? '' : '0' ) + hour,
                               ( min > 9 ? '' : '0' ) + min ].join(':'),
              dateTdDocPlan = [ ( day > 9 ? '' : '0' ) + day,  
                                ( month > 9 ? '' : '0' ) + month, 
                                  year ].join('.') ;
        return { timeTdDocPlan, dateTdDocPlan };
    }

    getDateDocPlanMS = ( dateTimeH, docEndMs ) => {
        //-----------------------------------------------------------
        // In: dateTimeH - 
        //     docEndMs - 
        // Out: dateDocPlanMS - 
        //-----------------------------------------------------------
        return new Date( +dateTimeH + +docEndMs );;
    }


    //-----------------------------------------------------------
    // For CardTask
    //-----------------------------------------------------------

    parseTimeStrToMs = (tm) => {
        //-----------------------------------------------------------
        // In: tm - 
        // Out: timeMS - 
        //-----------------------------------------------------------
        let timeMS = 0;
        if (tm != null) {
          if ((tm.length === 5) && (tm.includes(':', 2))) {
            const hours = tm.slice(0, 2), 
                  mins = tm.slice(3, 5);
                  timeMS = (+hours * 60 * 60 * 1000) + (+mins * 60 * 1000);
          } 
        }
        
        return timeMS;
    }

    getProgrValue = (today, dateTimeH, start, end) => {
        //-----------------------------------------------------------
        // In: today - 
        //     dateTimeH - 
        //     start - 
        //     end - 
        // Out: progressWidth - 
        //      remainedStr - 
        //-----------------------------------------------------------
        if ((today === "") || (dateTimeH === "") || (start === "") || (end === "") ) {
            return 3;
        }
        const deltaHToday = today - dateTimeH, 
              startDoc = this.parseTimeStrToMs(start), 
              endDoc = this.parseTimeStrToMs(end), 
              deltaDoc = endDoc - startDoc, 
              progressDoc = deltaHToday - startDoc; 
        const remained = endDoc - progressDoc, 
              remainedHour = Math.floor(remained / (60 * 60 * 1000)),
              remainedMin = Math.floor((remained - (remainedHour * 60 * 60 * 1000)) / (60 * 1000) ),
              addZeroH = (n) => {
                    if (n >= 0) {
                      n = n < 10 ? "закончится через 0" +  n : "закончится через " + n;
                    } else {
                        n = n > -10 ? " закончилось 0" + Math.abs(n) : " закончилось " + Math.abs(n); 
                    }
                    return n;
                },
              addZeroM = (h, n) => {
                  n = n < 10 ? "0" +  n : n;
                  n = (h < 0) ? n + " назад" : n;
                  return n;
                },
              remainedStr = `${addZeroH(remainedHour)}:${addZeroM(remainedHour, remainedMin)}`; 

        let progressWidth = 3;
        if (progressDoc < 0) {
            progressWidth = 0;
        } else if (progressDoc > deltaDoc) {
            progressWidth = 100;
        } else {
            progressWidth = Math.floor((progressDoc * 100) / deltaDoc);
        }
        
        return {progressWidth, remainedStr};
    }


    getProgrDocValue = (doc, dateTimeH) => {
      //-----------------------------------------------------------
      // In: doc - 
      //     dateTimeH - 
      // Out: progressWidth - 
      //      remainedStr - 
      //-----------------------------------------------------------

      const addZeroH = (n) => {
        n = (n < 10) ? '0'+n : n
        return n;
      };

      const today = new Date(),
            endDocMs = this.parseTimeStrToMs(doc.end), 
            endDocAstro = this.getDateDocPlanMS(dateTimeH, endDocMs); 
      let remainedStr = "",
          progressWidth = 0,
          checked = false;

      if (endDocMs != 0) { 
        if ( this.checkExecDoc(doc) ) { 
          let maxDocDateTimeMS = 0;
          doc.receivedTime.forEach( ctragt => {
            maxDocDateTimeMS = (maxDocDateTimeMS < this.parseDateTimeStrToMS(ctragt.received)) ? this.parseDateTimeStrToMS(ctragt.received) : maxDocDateTimeMS;
          });
          doc.deliveryTime.forEach( ctragt => {
            maxDocDateTimeMS = (maxDocDateTimeMS < this.parseDateTimeStrToMS(ctragt.delivery)) ? this.parseDateTimeStrToMS(ctragt.delivery) : maxDocDateTimeMS;
          });
          maxDocDateTimeMS = new Date( +maxDocDateTimeMS ); 
          const year = maxDocDateTimeMS.getFullYear(),
                month = addZeroH( maxDocDateTimeMS.getMonth() + 1 ),
                day = addZeroH( maxDocDateTimeMS.getDate() ),
                hours = addZeroH( maxDocDateTimeMS.getHours() ),
                min = addZeroH( maxDocDateTimeMS.getMinutes() );
          remainedStr = `документ исполнен: ${day}.${month}.${year} г. в ${hours}:${min}`;
          progressWidth = 100;
          checked = true;

        } else if ( endDocAstro > today ) {  
          const remained = new Date(+endDocAstro - +today), 
                day = remained.getUTCDate() - 1,
                hours = addZeroH( remained.getUTCHours() + (day * 24) ),
                min = addZeroH( remained.getUTCMinutes() );
          remainedStr = `до исполнения документа осталось ${hours}:${min}`;

          const startDocMs = this.parseTimeStrToMs(doc.start), 
                startDocAstro = this.getDateDocPlanMS(dateTimeH, startDocMs);
          if ( startDocAstro < today ) { 
            const deltaDoc = +endDocAstro - +startDocAstro, 
                  progressDoc = +today - +startDocAstro; 
            progressWidth = progressDoc * 100 / deltaDoc; 
          }

        } else {                            
          const expiration = new Date(+endDocAstro), 
              year = expiration.getFullYear(),
              month = addZeroH( expiration.getMonth() + 1 ),
              day = addZeroH( expiration.getDate() ),
              hours = addZeroH( expiration.getHours() ),
              min = addZeroH( expiration.getMinutes() );
          remainedStr = `документ не исполнен, срок исполнения: ${day}.${month}.${year} г. ${hours}:${min}`;
          progressWidth = 100;
        }

      } else {  

        const startDocAst = this.parseDateTimeStrToMS( doc.everydayCurrentPeriod.split('=')[0] ),
              endDocAst = this.parseDateTimeStrToMS( doc.everydayCurrentPeriod.split('=')[1] );
        let maxDocDate = 0,
            check = true;
        
        doc.receivedTime.forEach( ctragt => {
          ctragt.executed.forEach( exec => {
            if (exec != null) {
              if (exec.period === doc.everydayCurrentPeriod) {
                const valueMs = this.parseDateTimeStrToMS( exec.time );
                maxDocDate = (maxDocDate < valueMs) ? valueMs : maxDocDate;
                if (exec.time == "") { check = false }
              }
            }
          });
        });
        doc.deliveryTime.forEach( ctragt => {
          ctragt.executed.forEach( exec => {
            if (exec != null) {
              if (exec.period === doc.everydayCurrentPeriod) {
                const valueMs = this.parseDateTimeStrToMS( exec.time );
                maxDocDate = (maxDocDate < valueMs) ? valueMs : maxDocDate;
                if (exec.time == "") { check = false }
              }
            }
          });
        });

        if (check) { 
          maxDocDate = new Date( +maxDocDate ); 
          const year = maxDocDate.getFullYear(),
                month = addZeroH( maxDocDate.getMonth() + 1 ),
                day = addZeroH( maxDocDate.getDate() ),
                hours = addZeroH( maxDocDate.getHours() ),
                min = addZeroH( maxDocDate.getMinutes() );
          remainedStr = `документ исполнен: ${day}.${month}.${year} г. в ${hours}:${min}`
          progressWidth = 100;
          checked = true;

        } else if ( endDocAst > today ) { 
          const remained = new Date(+endDocAst - +today), 
                day = remained.getUTCDate() - 1,
                hours = addZeroH( remained.getUTCHours() + (day * 24) ),
                min = addZeroH( remained.getUTCMinutes() );
          remainedStr = `до исполнения документа осталось ${hours}:${min}`;

          const deltaDoc = +endDocAst - +startDocAst, 
                progressDoc = +today - +startDocAst; 
          progressWidth = progressDoc * 100 / deltaDoc; 

        } else {                         
          const year = endDocAst.getFullYear(),
              month = addZeroH( endDocAst.getMonth() + 1 ),
              day = addZeroH( endDocAst.getDate() ),
              hours = addZeroH( endDocAst.getHours() ),
              min = addZeroH( endDocAst.getMinutes() );
          remainedStr = `документ не исполнен, срок исполнения: ${day}.${month}.${year} г. ${hours}:${min}`;
          progressWidth = 100;
        }
      } 
      return { progressWidth, remainedStr, checked };
    }

    //------------------------------------------------------------------------
    // For PageHeader
    //------------------------------------------------------------------------

    getDateTimeHStr = (dateTimeH) => {
        //-----------------------------------------------------------
        // In: dateTimeH - 
        // Out: dayRes - 
        //      monthRes - 
        //      yearRes - 
        //      timeRes - 
        //-----------------------------------------------------------
        const monthStr = ['января', 
                        'февраля', 
                        'марта', 
                        'апреля', 
                        'мая', 
                        'июня', 
                        'июля', 
                        'августа', 
                        'сентября', 
                        'октября', 
                        'ноября', 
                        'декабря'];

        const addZeroH = (n) => {
            n = (n < 10) ? '0'+n : n
            return n;
        };

        const dateTimeHValue = new Date(+dateTimeH);

        let dayRes = '', 
            monthRes = '', 
            yearRes = '',
            timeRes = '';

        if (dateTimeHValue) {
            dayRes = dateTimeHValue.getDate();
            monthRes = monthStr[dateTimeHValue.getMonth()];
            yearRes = dateTimeHValue.getFullYear();
            timeRes = `${ addZeroH( dateTimeHValue.getHours() ) }:${ addZeroH( dateTimeHValue.getMinutes() ) }`;
        } else {
            dayRes = '--';
            monthRes = '--';
            yearRes = '----';
            timeRes = '--:--';
        }

        return { dayRes, monthRes, yearRes, timeRes }
    }

    //------------------------------------------------------------------------

    getDuration = (durationH) => {
        //-----------------------------------------------------------
        // In: durationH - 
        // Out: days, hours, mins - 
        //-----------------------------------------------------------
        let days = '',
            hours = '',
            mins = '';
        if (durationH) {
            const durationDate = new Date(+durationH);
            days = durationDate.getUTCDate() - 1;
            hours = durationDate.getUTCHours();
            mins = durationDate.getUTCMinutes();
            if (days == 0) {
                days = '';
            } else if (days == 1) {
                days = days + ' сутки';
            } else if ((days == 2) || (days == 3) || (days == 4)) {
                days = days + ' суток';
            } else {
                days = days + ' суток';
            }
            if (hours == 0) {
                hours = '';
            } else if (hours == 1) {
                hours = hours + ' час';
            } else if ((hours == 2) || (hours == 3) || (hours == 4)) {
                hours = hours + ' часа';
            } else {
                hours = hours + ' часов';
            }
            if (mins == 0) {
                mins = '';
            } else if (mins == 1) {
                mins = mins + ' минута';
            } else if ((mins == 2) || (mins == 3) || (mins == 4)) {
                mins = mins + ' минуты';
            } else {
                mins = mins + ' минут';
            }
        }
        return { days, hours, mins };
    }

    //------------------------------------------------------------------------

    getDurationHours = (durationH) => {
        //-----------------------------------------------------------
        // In: durationH - 
        // Out: hours, mins - 
        //-----------------------------------------------------------
        let days = '',
            hours = '',
            mins = '';
        if (durationH) {
            const durationDate = new Date(+durationH);
            days = durationDate.getUTCDate() - 1;
            hours = durationDate.getUTCHours() + (days * 24);
            mins = durationDate.getUTCMinutes();
            hours = String(hours);
            let lastChar = hours.slice(-1);
            if (hours == 0) {
                hours = '';
            } else if (lastChar == 1) {
                hours = hours + ' час';
            } else if ((lastChar == 2) || (lastChar == 3) || (lastChar == 4) ) {
                hours = hours + ' часа';
            } else {
                hours = hours + ' часов';
            }
            mins = String(mins);
            lastChar = mins.slice(-1);
            if (mins == 0) {
                mins = '';
            } else if (lastChar == 1) {
                mins = mins + ' минута';
            } else if ((lastChar == 2) || (lastChar == 3) || (lastChar == 4)) {
                mins = mins + ' минуты';
            } else {
                mins = mins + ' минут';
            }
        }
        return { hours, mins };
    }

    //------------------------------------------------------------------------

    getWidthProgressBar = (dateTimeH, durationH, today) => {
        //-----------------------------------------------------------
        // In: dateTimeH - 
        //     durationH - 
        //     today - 
        // Out: width - 
        //-----------------------------------------------------------
        const progress = today - dateTimeH;
        let width = 3;
        if (progress >= durationH) {
            width = 100;
        } else {
            width = Math.floor((progress * 100) / durationH);
        }
        return width;
    }

    //------------------------------------------------------------------------
    // For TdReceived
    //------------------------------------------------------------------------

    getRemadedDateTime = (dateTime) => {
        //-----------------------------------------------------------
        // In: dateTime - 
        // Out: remadedTime - 
        //      remadedDate - 
        //-----------------------------------------------------------
        const newDT =  new Date(Date.parse(dateTime)),
              year = newDT.getFullYear(),
              month = newDT.getMonth() + 1,
              day = newDT.getDate(),
              hours = newDT.getHours(),
              min = newDT.getMinutes(),
              remadedTime = [(hours > 9 ? '' : '0') + hours, (min > 9 ? '' : '0') + min].join(':'),
              remadedDate = [(day > 9 ? '' : '0') + day, (month > 9 ? '' : '0') + month, year].join('.');

        return { remadedTime, remadedDate };
    }

    //------------------------------------------------------------------------

    getRemadedDateTimeToSourcedata = (dateTime) => {
        //-----------------------------------------------------------
        // In: dateTime - 
        // Out: remadedTime - 
        //      remadedDate - 
        //-----------------------------------------------------------
        const newDT =  new Date(Date.parse(dateTime)),
              year = newDT.getFullYear(),
              month = newDT.getMonth() + 1,
              day = newDT.getDate(),
              hours = newDT.getHours(),
              min = newDT.getMinutes(),
              dateH = [year, (month > 9 ? '' : '0') + month, (day > 9 ? '' : '0') + day].join('-'),
              timeH = [(hours > 9 ? '' : '0') + hours, (min > 9 ? '' : '0') + min].join(':');

        return { dateH, timeH };
    }

    //------------------------------------------------------------------------

    parseDateTimeStrToMS = (dateTime) => {
        //-----------------------------------------------------------
        // In: dateTime - 
        // Out: 
        //-----------------------------------------------------------
        return new Date(Date.parse(dateTime));
    }

    //------------------------------------------------------------------------

    addDayAstroToSrt(dateTimeMsDate) {
        //-----------------------------------------------------------
        // In: dateTimeMsDate - 
        // Out: dateStr - 
        //-----------------------------------------------------------
        const dateTimeMs = +dateTimeMsDate,
              addDay = dateTimeMs + ( 24 * 60 * 60 * 1000 ),
              newDT = new Date(addDay),
              year = newDT.getFullYear(),
              month = newDT.getMonth() + 1,
              day = newDT.getDate(),
              dateStr = [(day > 9 ? '' : '0') + day, (month > 9 ? '' : '0') + month, year].join('.');
        return dateStr;
    }
}    
