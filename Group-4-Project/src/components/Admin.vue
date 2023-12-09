<template>
    <div class='admin'>
        <div class="navbar">
            <div class="welcome">
                <p>{{ 'Welcome ' + currentUser.nickname }}</p>
            </div>
            <div class="button">
                <button @click="logOut()" type="button">Log out</button>
            </div>
        </div>
        <div class="admin-body">
            <div class="add-class-div">
                <p>Add Class:</p>
                <form @submit.prevent="addClassCheck" class="add-class">
                    <div v-for="field in classFields">
                        <input v-model="field.var" type="text" :id="field.id" :placeholder="field.placeholder"><br><br>
                    </div>
                    <button @click="addClassCheck()" type="button">Add Class</button>
                    <p>{{ message }}</p>
                </form>
            </div>
            <div class="admin-grid">
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
                <AdminGrid :data="classes" :filter-key="searchQuery" @removeClass="removeClass($event)" class="class-search"></AdminGrid>
            </div>
        </div>
    </div>
</template>

<script>
import AdminGrid from './AdminGrid.vue'

export default {
    data() {
        return {
            selectedSubject: 'Select a Subject',
            classes: [],
            classFields: [
                { var: '', id: 'subject', placeholder: 'Subject', empty: false },
                { var: '', id: 'name', placeholder: 'Name', empty: false },
                { var: '', id: 'number', placeholder: 'Number', empty: false },
                { var: '', id: 'professor', placeholder: 'Professor', empty: false },
                { var: '', id: 'credits', placeholder: 'Credits', empty: false },
                { var: '', id: 'mon', placeholder: 'Monday time', empty: true },
                { var: '', id: 'tue', placeholder: 'Tuesday time', empty: true },
                { var: '', id: 'wed', placeholder: 'Wednesday time', empty: true },
                { var: '', id: 'thr', placeholder: 'Thursday time', empty: true },
                { var: '', id: 'fri', placeholder: 'Friday time', empty: true},
            ],
            currentSubjectubject: '',
            searchQuery: '',
            message: ''
        }
    },
    props: ['currentUser', 'subjects'],
    components: {
        AdminGrid,
    },
    methods: {
        logOut() {
            this.$auth0.logout({ logoutParams: { returnTo: window.location.origin } });
            this.$emit('logOut')
        },
        async addClass() {

            const data = {
                "Subject": this.classFields[0].var,
                "ClassId": Math.floor(100000 + Math.random() * 900000).toString(),
                "name": this.classFields[1].var,
                "number": this.classFields[2].var,
                "professor": this.classFields[3].var,
                "credits": this.classFields[4].var,
                "mon": this.classFields[5].var,
                "tue": this.classFields[6].var,
                "wed": this.classFields[7].var,
                "thr": this.classFields[8].var,
                "fri": this.classFields[9].var
            }

            if (this.currentSubject == this.classFields[0].var) {
                const newClass = {
                    'Subject': data.Subject,
                    'Class ID': data.ClassId,
                    'Name': data.name,
                    'Number': data.number,
                    'Professor': data.professor,
                    'Credits': data.credits,
                    'Mon': data.mon,
                    'Tue': data.tue,
                    'Wed': data.wed,
                    'Thr': data.thr,
                    'Fri': data.fri,
                }
                this.classes.push(newClass)
                this.classes.sort((a, b) => a.Number - b.Number);
            }
            let dropdownSubject = this.classFields[0].var
            for (let i = 0; i < this.classFields.length; i++) {
                this.classFields[i].var = ''
            }
            this.message = ''
            
            if (!(this.subjects.includes(dropdownSubject)) && this.subjects != 'Select a Subject') {
                    this.subjects.shift()
                    this.subjects.push(dropdownSubject)
                    let newSubject = {
                        "Subject": "Subjects", 
                        "Class ID": "1", 
                        "subjects": this.subjects
                    }
                    this.subjects.unshift('Select a Subject')
                    let response = await fetch("https://yhw30hsvu5.execute-api.us-east-1.amazonaws.com/classes/dynamodbmanager/", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newSubject)
                    })
                }
            

            let response = await fetch("https://yhw30hsvu5.execute-api.us-east-1.amazonaws.com/classes/dynamodbmanager/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
        },
        addClassCheck() {
            let check = true
            const pattern = /^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/
            for (let i = 5; i < 10; i++) {
                let formatCheck = (pattern.test(this.classFields[i].var) || this.classFields[i].var == '')
                if(!formatCheck) {
                    check = false
                    this.message = 'Please format class time as follows 9:00-10:00'
                }
            }
            for (let i = 0; i < this.classFields.length; i++) {
                
                if (this.classFields[i].var == '' && this.classFields[i].empty && check) {
                    this.classFields[i].var = 'No Class'
                }

                if (this.classFields[i].var == '' && check) {
                    check = false
                    this.message = 'Please fill in all fields.'
                    break
                }
            }         
            if (check) {
                    this.addClass()
                }
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
        removeClass(ClassId) {
            this.classes = this.classes.filter(classObj => classObj['Class ID'] !== ClassId)
        }
    }
}
</script>

<style>
.navbar {
    display: flex;
    align-items: baseline;
    background-color: #000080;
}

.welcome {
    color: white;
    font-size: 20px;
    text-align: center;
    padding: 10px 10px;
    text-decoration: none;
}

.button {
    margin-left: auto;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}

.admin-body{
    display: grid;
    grid-template-columns: 20% 80%;
    grid-template-areas: 'form grid';
}

.add-class-div{
    grid-area: form;
}

.admin-grid{
    grid-area: grid;
}

</style>