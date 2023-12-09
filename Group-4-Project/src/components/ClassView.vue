<template>
    <div class="class-grid">
        <div v-for="day in days" :class="day" class="day">
            <p>{{ day }}</p>
        </div>
        <div v-for="time in times" :class="'t'+time" class="time">
            <p>{{ time }}</p>
        </div>
        <div v-for="timeSlot in timeSlots" :class="'ts'+timeSlot" class="time"></div>
        <div v-for="data in classHelper" :style="{ gridArea: data.grid, borderTop: 'solid', borderLeft: 'solid', borderColor: '#999'}" class="course">
            {{ data.name + ' ' + data.number + ' ' + data.time }}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            times: ['8:00', '9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', ],
            //gridData: [],
            dayTime: {'Mon': 2, 'Tue': 3, 'Wed': 4, 'Thr': 5, 'Fri': 6},
            hour: {'8': 4, '9': 8, '10': 12, '11': 16, '12': 20, '1': 24, '2': 28, '3': 32, '4': 36, '5': 40, '6': 44, '7': 48},    
            timeSlots: [
                '8:00', '8:15', '8:30', '8:45',
                '9:00', '9:15', '9:30', '9:45',
                '10:00', '10:15', '10:30', '10:45',
                '11:00', '11:15', '11:30', '11:45',
                '12:00', '12:15', '12:30', '12:45',
                '1:00', '1:15', '1:30', '1:45',
                '2:00', '2:15', '2:30', '2:45',
                '3:00', '3:15', '3:30', '3:45',
                '4:00', '4:15', '4:30', '4:45',
                '5:00', '5:15', '5:30', '5:45',
                '6:00', '6:15', '6:30', '6:45',
                '7:00', '7:15', '7:30', '7:45',
            ]
        }
    },
    props: ['courses'],
    computed: {
        classHelper() {
            const key = ['Mon', 'Tue', 'Wed', 'Thr', 'Fri']
            let gridData=[]
            for(let i = 0; i < this.courses.length; i++) {
                let course = this.courses[i]
                for (let j = 0; j < 5; j++){
                    let day = key[j]
                    if (course[day] != 'No Class') {
                        let grid = this.timeToGrid(day, course[day])
                        let time = course[day]
                        let name = course['Name']
                        let number = course['Number']
                        gridData.push({'name': name,'number': number, 'time': time, 'grid': grid})
                    }
                }
            }
            return gridData
        }
    },
    methods: {
        timeConvert(min) {
            if (8 <= min && min <= 22) {
                return 1
            }
            else if (23 <= min && min <= 37) {
                return 2
            }
            else if (38 <= min && min <= 52) {
                return 3
            }
            else
                return 0
        },
        timeToGrid(day, time) {
            let startTime = time.split('-')[0]
            let endTime = time.split('-')[1]

            let gridTimeStart = this.hour[startTime.split(':')[0]] + this.timeConvert(startTime.split(':')[1])
            let gridTimeEnd = this.hour[endTime.split(':')[0]] + this.timeConvert(endTime.split(':')[1])

            let dayStart = this.dayTime[day]
            let dayEnd = dayStart + 1

            let gridArea = gridTimeStart.toString() + '/' + dayStart.toString() + '/' + gridTimeEnd.toString() + '/' + dayEnd.toString()
            return gridArea
        },
    }
}
</script>

<style>
.class-grid {
    display: grid;
    grid-template-columns: repeat(6, 100px);
    grid-template-rows: repeat(51, 25px);
    border-style: solid; 
    border-color: #999;
    width: 600px;
}
.day {
    text-align: center;
    border-left: solid;
    border-color: #999;
}
.time{
    border-top: solid;
    text-align: center;
    border-color: #999;
}
.course{
    text-align: center;
    margin: 0px;
    background-color: rgb(56, 198, 70);
}
.Monday{grid-area: 1 / 2 / 53 / 3;}
.Tuesday{grid-area: 1 / 3 / 53 / 4;}
.Wednesday{grid-area: 1 / 4 / 53 / 5;}
.Thursday{grid-area: 1 / 5 / 53 / 6;}
.Friday{grid-area: 1 / 6 / 53 / 7;}
.t8\:00{grid-area: 4 / 1 / 8 / 2;}
.t9\:00{grid-area: 8 / 1 / 12 / 2;}
.t10\:00{grid-area: 12 / 1 / 16 / 2;}
.t11\:00{grid-area: 16 / 1 / 20 / 2;}
.t12\:00{grid-area: 20 / 1 / 24 / 2;}
.t1\:00{grid-area: 24 / 1 / 28 / 2;}
.t2\:00{grid-area: 28 / 1 / 32 / 2;}
.t3\:00{grid-area: 32 / 1 / 36 / 2;}
.t4\:00{grid-area: 36 / 1 / 40 / 2;}
.t5\:00{grid-area: 40 / 1 / 44 / 2;}
.t6\:00{grid-area: 44 / 1 / 48 / 2;}
.t7\:00{grid-area: 48 / 1 / 52 / 2;}
.ts8\:00{grid-area: 4/2/5/7}
.ts8\:15{grid-area: 5/2/6/7}
.ts8\:30{grid-area: 6/2/7/7}
.ts8\:45{grid-area: 7/2/8/7}
.ts9\:00{grid-area: 8/2/9/7}
.ts9\:15{grid-area: 9/2/10/7}
.ts9\:30{grid-area: 10/2/11/7}
.ts9\:45{grid-area: 11/2/12/7}
.ts10\:00{grid-area: 12/2/13/7}
.ts10\:15{grid-area: 13/2/14/7}
.ts10\:30{grid-area: 14/2/15/7}
.ts10\:45{grid-area: 15/2/16/7}
.ts11\:00{grid-area: 16/2/17/7}
.ts11\:15{grid-area: 17/2/18/7}
.ts11\:30{grid-area: 18/2/19/7}
.ts11\:45{grid-area: 19/2/20/7}
.ts12\:00{grid-area: 20/2/21/7}
.ts12\:15{grid-area: 21/2/22/7}
.ts12\:30{grid-area: 22/2/23/7}
.ts12\:45{grid-area: 23/2/24/7}
.ts1\:00{grid-area: 24/2/25/7}
.ts1\:15{grid-area: 25/2/26/7}
.ts1\:30{grid-area: 26/2/27/7}
.ts1\:45{grid-area: 27/2/28/7}
.ts2\:00{grid-area: 28/2/29/7}
.ts2\:15{grid-area: 29/2/30/7}
.ts2\:30{grid-area: 30/2/31/7}
.ts2\:45{grid-area: 31/2/32/7}
.ts3\:00{grid-area: 32/2/33/7}
.ts3\:15{grid-area: 33/2/34/7}
.ts3\:30{grid-area: 34/2/35/7}
.ts3\:45{grid-area: 35/2/36/7}
.ts4\:00{grid-area: 36/2/37/7}
.ts4\:15{grid-area: 37/2/38/7}
.ts4\:30{grid-area: 38/2/39/7}
.ts4\:45{grid-area: 39/2/40/7}
.ts5\:00{grid-area: 40/2/41/7}
.ts5\:15{grid-area: 41/2/42/7}
.ts5\:30{grid-area: 42/2/43/7}
.ts5\:45{grid-area: 43/2/44/7}
.ts6\:00{grid-area: 44/2/45/7}
.ts6\:15{grid-area: 45/2/46/7}
.ts6\:30{grid-area: 46/2/47/7}
.ts6\:45{grid-area: 47/2/48/7}
.ts7\:00{grid-area: 48/2/49/7}
.ts7\:15{grid-area: 49/2/50/7}
.ts7\:30{grid-area: 50/2/51/7}
.ts7\:45{grid-area: 51/2/52/7}
</style>