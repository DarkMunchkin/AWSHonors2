<template>
    <div class='student'>
        <div class="navbar">
            <div class="welcome">
                <p>{{ 'Welcome ' + currentUser.nickname }}</p>
            </div>
            <div class="button">
                <button @click="logOut()" type="button">Log out</button>
            </div>
        </div>  

        <div class='student-body'>
            <div class="student grid">
                <div>
                    <p>Search Class Subject:</p>
                    <select v-model="selectedSubject">
                        <option v-for="subject in subjects">{{ subject }}</option>
                    </select>
                    <button @click="getSubjectCheck()">Search</button>
                </div>
                <form class="search">
                    <p>Search for Classes:</p>
                    <input class="class-search" type="query" v-model="searchQuery">
                </form>
                <StudentAddGrid @addClass="addClassCheck($event)" :data="classes" :filter-key="searchQuery"></StudentAddGrid>
                <StudentClassGrid @removeUserClass="removeUserClass($event)" :data="userClasses"></StudentClassGrid>
            </div>
            <p>Total Credits: {{ credits }}</p>
            <div class="class-view">
                <ClassView :courses="userClasses"></ClassView>
            </div>
        </div>
    </div>
</template>

<script>
import StudentAddGrid from './StudentAddGrid.vue'
import StudentClassGrid from './StudentClassGrid.vue'
import ClassView from './ClassView.vue'

export default {
    data() {
        return {
            classes: [],
            searchQuery: '',
            selectedSubject: 'Select a Subject',
            currentSubject: '',
        }
    },
    components: {
        StudentAddGrid,
        StudentClassGrid,
        ClassView
    },
    props:['currentUser', 'subjects', 'userClasses', 'credits'],
    methods: {
        logOut() {
            this.$auth0.logout({ logoutParams: { returnTo: window.location.origin } });
            this.classes = []
            this.$emit('logOut')
        },
        async getSubject() {
            let url = "https://yhw30hsvu5.execute-api.us-east-1.amazonaws.com/classes/dynamodbmanager?subject=" + this.selectedSubject
            this.currentSubject = this.selectedSubject
            const response = await fetch(url)
            const classL = await response.json()
            this.classes = []
            for (let i = 0; i < classL.Count; i++) {
                const newClass = {
                    'Subject': classL.Items[i].Subject.S,
                    'Class ID': classL.Items[i].ClassId.S,
                    'Name': classL.Items[i].name.S,
                    'Number': classL.Items[i].number.S,
                    'Professor': classL.Items[i].professor.S,
                    'Credits': classL.Items[i].credits.S,
                    'Mon': classL.Items[i].mon.S,
                    'Tue': classL.Items[i].tue.S,
                    'Wed': classL.Items[i].wed.S,
                    'Thr': classL.Items[i].thr.S,
                    'Fri': classL.Items[i].fri.S,
                }
                this.classes.push(newClass)
                this.classes.sort((a, b) => a.Number - b.Number);
            }
        },
        getSubjectCheck() {
            if (this.selectedSubject != 'Select a Subject' && this.selectedSubject != this.currentSubject) {
                console.log('Getting', this.selectedSubject)
                this.getSubject()
            }
        },
        addClassCheck(ClassId) {
            let check = true
            const days = ["Mon", "Tue", "Wed", "Thr", "Fri"]
            const checkClass = this.classes.filter(classObj => classObj['Class ID'] === ClassId)[0]
            const currentCredits = parseInt(this.credits)
            const newCredits = parseInt(checkClass.Credits)
            if (newCredits + currentCredits > 20) {
                check = false
            }
            if (this.userClasses.filter(classObj => classObj['Class ID'] === ClassId)[0] !== undefined) {
                check = false
                console.log('Already added')
            }
            for (const checkUserClass of this.userClasses) {
                for (const day of days) {
                    if(checkUserClass[day] !== 'No Class' && checkClass[day] !== 'No Class' && check) {
                        let class1 = checkUserClass[day].split('-')
                        let class2 = checkClass[day].split('-')
                        class1[0] = class1[0].split(':')
                        class1[1] = class1[1].split(':')
                        class2[0] = class2[0].split(':')
                        class2[1] = class2[1].split(':')
                        class1[0][0] = parseInt(class1[0][0])
                        class1[0][1] = parseInt(class1[0][1])
                        class1[1][0] = parseInt(class1[1][0])
                        class1[1][1] = parseInt(class1[1][1])
                        class2[0][0] = parseInt(class2[0][0])
                        class2[0][1] = parseInt(class2[0][1])
                        class2[1][0] = parseInt(class2[1][0])
                        class2[1][1] = parseInt(class2[1][1])
                        if (class1[1][0] < class1[0][0]) {
                            class1[1][0] += 12;
                        }
                        if (class2[1][0] < class2[0][0]) {
                            class2[1][0] += 12;
                        }
                        let min1 = [class1[0][0] * 60 + class1[0][1], class1[1][0] * 60 + class1[1][1]]
                        let min2 = [class2[0][0] * 60 + class2[0][1], class2[1][0] * 60 + class2[1][1]]
                        let first 
                        let second 
                        if (min1[0] < min2[0]) {
                            first = min1
                            second = min2
                        }
                        else {
                            first = min2
                            second = min1
                        }
                        if (!(first[0] > second[1] || second[0] > first[1])) {
                            check = false
                            console.log("classes over lap")
                        }
                    }
                }
            }
            if(check) {
                this.addClass(ClassId)
            }
        },
        async addClass(ClassId) {
            let newClass = this.classes.filter(classObj => classObj['Class ID'] === ClassId)[0]
            this.$emit('credits', parseInt(newClass.Credits))
            this.userClasses.push(newClass)
            let credits = 0
            let classes = []
            const id = this.currentUser.sub.split("|")[1]
            for(let i = 0; i < this.userClasses.length; i++) {
                credits += parseInt(this.userClasses[i].Credits)
                const subjectId = "" + this.userClasses[i].Subject + "|" + this.userClasses[i]['Class ID'] + ""
                classes.push(subjectId)
            }
            const data = {
                "authId": id,
                "num_classes": this.userClasses.length.toString(),
                "credits": credits.toString(),
                "classes": classes
            }
            const url = "https://bsp4pnlfai.execute-api.us-east-1.amazonaws.com/Prod/users"
            let response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
        },
        removeUserClass(ClassId) {
            this.$emit('removeClass', ClassId)
        },
    }
}
</script>

<style>
.navbar{
    display: flex;
    align-items: baseline;
    background-color: #000080;
}
.welcome{
    color: white;
    font-size: 20px;
    text-align: center;
    padding: 10px 10px;
    text-decoration: none;
}
.button{
    margin-left: auto;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}
.search{
    padding-bottom: 8px;
}
.search p{
    margin: 8px 0 0 0;
}
</style>
