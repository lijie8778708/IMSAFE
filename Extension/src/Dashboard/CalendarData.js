import { getMembersById } from "../API/memberAPI";
import { getUser } from "../API/userAPI";
import { getActivityByMember } from "../API/activityAPI";

/* global chrome */

const colors = ["none", "#DA59B6", "#7A64D1", "#52B7B7", "#FF4D4D", "#FFFF66"];

export default function (callback) {
  let groups = [];

  groups.push({ id: "0", title: "confirmed" });
  let items = [];

  let unarranged = [];

  //chrome.storage.sync.remove("newEvents");

  chrome.storage.sync.get(
    ["currTripInfo", "userID", "newEvents", "deletedEvents", "updatedEvents"],
    (res) => {
      //console.log(res.currTripInfo);
      //console.log(res.userID);
      let userID = res.userID;

      // AD
      //userID = "5fa8ebd6f4c99f70d0cc9105";
      // DT
      //userID = "5fa8ec1df4c99f70d0cc9106";

      let captainID = res.currTripInfo.captainId;

      let tripID = res.currTripInfo._id;
      let newEvents = res.newEvents;

      let deletedEvents = res.deletedEvents;
      if (deletedEvents === undefined) {
        deletedEvents = [];
        chrome.storage.sync.set({ deletedEvents: [] });
      }

      let updatedEvents = res.updatedEvents;
      if (res.updatedEvents === undefined) {
        updatedEvents = [];
        chrome.storage.sync.set({ updatedEvents: [] });
      }

      getMembersById(res.currTripInfo._id, (res) => {
        const userInfo = new Promise((resolve, reject) => {
          res.member.forEach((ele, index, array) => {
            getUser(ele.user_id, (res) => {
              unarranged.push({
                id: res.user._id,
                title: res.user.name,
                icon: res.user.icon_url,
              });
              if (unarranged.length === array.length) {
                resolve();
              }
            });
          });
        });

        // const activitiesInfo = new Promise((resolve, reject) => {
        //   getActivityByMember({ trip_id: tripID, user_id: captainID }, (res) => {
        //     console.log("done2");
        //     console.log(res);
        //     resolve();
        //   });
        // });

        let membersCount = 0;
        const activitiesInfo = new Promise((resolve, reject) => {
          res.member.forEach((ele, index, array) => {
            getActivityByMember(
              { trip_id: tripID, user_id: ele.user_id },
              (res) => {
                //console.log(res);

                let groupID, startTime, endTime, updatedIndex;
                res.activities.forEach((activity) => {
                  if (
                    deletedEvents.findIndex(
                      (deletedItem) => activity._id === deletedItem.id
                    ) === -1
                  ) {
                    if (activity.is_confirmed) {
                      groupID = "0";
                    } else {
                      groupID = activity.user_id;
                    }

                    updatedIndex = updatedEvents.findIndex(
                      (updatedItem) => activity._id === updatedItem.activity_id
                    );
                    if (updatedIndex === -1) {
                      startTime = activity.start_time;
                      endTime = activity.end_time;
                    } else {
                      let updatedItem = updatedEvents[updatedIndex];
                      startTime = updatedItem.start_time;
                      endTime = updatedItem.end_time;
                    }

                    items.push({
                      id: activity._id,
                      group: groupID,
                      title: activity.title,
                      start: startTime,
                      end: endTime,
                    });
                  }
                });

                membersCount += 1;
                if (membersCount === array.length) {
                  resolve();
                }
              }
            );
          });
        });

        Promise.all([userInfo, activitiesInfo]).then(() => {
          // unarranged.push({
          //   id: "2",
          //   title: "nig",
          // });

          // unarranged.push({
          //   id: "1",
          //   title: "nig2",
          // });

          unarranged.sort(function (a, b) {
            let x = a.title.toLowerCase();
            let y = b.title.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
          });

          unarranged.forEach((ele, index) => {
            if (captainID === ele.id) {
              groups.push(ele);
              unarranged.splice(index, 1);
            }
          });

          if (userID === captainID) {
            unarranged.forEach((ele) => {
              groups.push(ele);
            });
          } else {
            unarranged.forEach((ele, index) => {
              if (userID === ele.id) {
                groups.push(ele);
                unarranged.splice(index, 1);
              }
            });
            unarranged.forEach((ele) => {
              groups.push(ele);
            });
          }

          groups.forEach((ele, index) => {
            ele.color = colors[index];
          });

          if (newEvents !== undefined) {
            let groupID;
            newEvents.forEach((item, index) => {
              if (item.tripID === tripID) {
                //console.log(index);
                //console.log(item);

                if (item.isConfirmed) {
                  //console.log(item)
                  groupID = "0";
                } else {
                  groupID = item.userID;
                }
                items.push({
                  id: item.id,
                  group: groupID,
                  title: item.title,
                  start: item.startTime,
                  end: item.endTime,
                });
              }
            });
          }

          items.forEach((item) => {
            item.itemProps = {
              style: {
                minHeight: "50px",
                maxHeight: "50px",
              },
            };
          });
          // items.push({
          //   id: "1",
          //   group: "0",
          //   title: "ok123321412341241241243123123",
          //   start: moment().startOf("day").valueOf(),
          //   end: moment().startOf("day").add(1, "hours").valueOf(),
          //   itemProps: {
          //     style: {
          //       fontWeight: "bold",
          //       minHeight: "50px",
          //       maxHeight: "50px",
          //       overflow: "hidden",
          //     },
          //   },
          // });
          //console.log(groups);
          //console.log("All done!");
          //console.log(tripID.length);
          //console.log(dest);
          //console.log(items.length);
          //console.log(items);
          callback({ groups, items, captainID, userID });
        });
      });
    }
  );

  // let fake = {
  //   members: [
  //     {
  //       currUser: false,
  //       captian: false,
  //       name: 'member2',
  //       activities: [
  //         {
  //           startTime: moment().startOf('day').add(8, 'hours').valueOf(),
  //           endTime: moment().startOf('day').add(9, 'hours').valueOf(),
  //           title: 'member2-1',
  //         },
  //         {
  //           startTime: moment().startOf('day').add(10, 'hours').valueOf(),
  //           endTime: moment().startOf('day').add(11, 'hours').valueOf(),
  //           title: 'member2-2',
  //         },
  //       ],
  //     },
  //     {
  //       currUser: true,
  //       captian: true,
  //       name: 'member1',
  //       activities: [
  //         {
  //           startTime: moment().startOf('day').add(10, 'hours').valueOf(),
  //           endTime: moment().startOf('day').add(11, 'hours').valueOf(),
  //           title: 'member1',
  //         },
  //       ],
  //     },
  //     {
  //       currUser: false,
  //       captian: false,
  //       name: 'member3',
  //       activities: [
  //         {
  //           startTime: moment().startOf('day').add(15, 'hours').valueOf(),
  //           endTime: moment().startOf('day').add(16, 'hours').valueOf(),
  //           title: 'member3',
  //         },
  //       ],
  //     },
  //     {
  //       currUser: false,
  //       captian: false,
  //       name: 'member4',
  //       activities: [
  //         {
  //           startTime: moment().startOf('day').add(15, 'hours').valueOf(),
  //           endTime: moment().startOf('day').add(16, 'hours').valueOf(),
  //           title: 'member4',
  //         },
  //       ],
  //     },
  //     {
  //       currUser: false,
  //       captian: false,
  //       name: 'member5',
  //       activities: [
  //         {
  //           startTime: moment().startOf('day').add(15, 'hours').valueOf(),
  //           endTime: moment().startOf('day').add(16, 'hours').valueOf(),
  //           title: 'member5',
  //         },
  //       ],
  //     },
  //   ],
  //   confirmed: [
  //     {
  //       startTime: moment().startOf('day').add(15, 'hours').valueOf(),
  //       endTime: moment().startOf('day').add(16, 'hours').valueOf(),
  //       title: 'confirmed',
  //     },
  //   ],
  // }

  // let groups = []

  // groups.push({ id: '0', title: 'confirmed' })

  // let currUserIsCaptain = false

  // let memberIndex = []
  // for (let i = 0; i < fake.members.length; i++) {
  //   if (fake.members[i].captian) {
  //     groups.push({
  //       id: '1',
  //       title: fake.members[i].name,
  //     })
  //     if (fake.members[i].currUser) {
  //       currUserIsCaptain = true
  //     }
  //     memberIndex.push(i)
  //   }
  // }

  // let nextID = 2
  // if (currUserIsCaptain) {
  //   for (let i = 0; i < fake.members.length; i++) {
  //     if (!fake.members[i].captian) {
  //       groups.push({
  //         id: `${nextID}`,
  //         title: fake.members[i].name,
  //       })
  //       nextID += 1
  //       memberIndex.push(i)
  //     }
  //   }
  // } else {
  //   for (let i = 0; i < fake.members.length; i++) {
  //     if (fake.members[i].currUser) {
  //       groups.push({
  //         id: `${nextID}`,
  //         title: fake.members[i].name,
  //       })
  //       nextID += 1
  //       memberIndex.push(i)
  //     }
  //   }
  //   for (let i = 0; i < fake.members.length; i++) {
  //     if (!fake.members[i].currUser && !fake.members[i].captian) {
  //       groups.push({
  //         id: `${nextID}`,
  //         title: fake.members[i].name,
  //       })
  //       nextID += 1
  //       memberIndex.push(i)
  //     }
  //   }
  // }

  // let items = []

  // let itemID = 0
  // for (let i = 0; i < fake.confirmed.length; i++) {
  //   items.push({
  //     id: itemID + '',
  //     group: '0',
  //     title: fake.confirmed[i].title,
  //     start: fake.confirmed[i].startTime,
  //     end: fake.confirmed[i].endTime,
  //     itemProps: {
  //       style: {
  //         fontWeight: 'bold',
  //         minHeight: '50px',
  //         maxHeight: '50px',
  //         overflow: 'hidden',
  //       },
  //     },
  //   })
  //   itemID += 1
  // }

  // for (let i = 0; i < memberIndex.length; i++) {
  //   for (let j = 0; j < fake.members[memberIndex[i]].activities.length; j++) {
  //     items.push({
  //       id: itemID + '',
  //       group: i + 1 + '',
  //       title: fake.members[memberIndex[i]].activities[j].title,
  //       start: fake.members[memberIndex[i]].activities[j].startTime,
  //       end: fake.members[memberIndex[i]].activities[j].endTime,
  //       itemProps: {
  //         style: {
  //           fontWeight: 'bold',
  //           minHeight: '50px',
  //           maxHeight: '50px',
  //           overflow: 'hidden',
  //         },
  //       },
  //     })
  //     itemID += 1
  //   }
  // }

  // items = items.sort((a, b) => b - a);

  //return { groups, items };
}
