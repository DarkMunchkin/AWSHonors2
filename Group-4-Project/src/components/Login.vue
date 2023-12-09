<template>
    <div class="login">
        <div><h1>University Login</h1></div>
        <div><img class="jonathan" src="https://pbs.twimg.com/profile_images/1674053309555003397/OWq1rXvv_400x400.jpg" alt="Welcome!"></div>
        <div class="login-button"><button @click="loginCheck()" type="button">Login</button></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentUser: '',
            userData: {},
            activeGroup: 'Student',
            groups: ['Student', 'Professor', 'Admin'],
            loggedin: this.$auth0.isAuthenticated,
            user: this.$auth0.user
        }
    },
    watch: {
        async user(newUser) {
            if (newUser != undefined) {
                let id = newUser.sub.split('|')[1]
                const url = 'https://bsp4pnlfai.execute-api.us-east-1.amazonaws.com/Prod/users?id=' + id
                const response = await fetch(url)
                let data = await response.json()
                if (data.Count === 0) {
                    data = {
                        "authId": id,   
                        "type": 'Student',
                        "credits": "0",
                        "num_classes": "0",
                        "classes": ["No Classes"]
                    }
                    let postResponse = await fetch("https://bsp4pnlfai.execute-api.us-east-1.amazonaws.com/Prod/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data)
                    })
                    this.userData = data
                    this.activeGroup = 'Student'
                }
                else {
                    this.activeGroup = data.Items[0].type.S
                    let formatData =  {
                        "authId": id, 
                        "type": data.Items[0].type.S,
                        "credits": data.Items[0].credits.S,
                        "num_classes": data.Items[0].num_classes.S,
                        "classes": data.Items[0].classes.SS
                    }
                    this.userData = formatData
                }
                this.changeScreen()
            }
        },
    },
    methods: {
        changeGroup(newGroup) {
            this.activeGroup = newGroup
        },
        loginCheck() {
            if (this.loggedin == false) {
                this.$auth0.loginWithRedirect();
            }
        },
        changeScreen() {
            this.$emit('changeScreen', {
                group: this.activeGroup, 
                user: this.$auth0.user, 
                data: this.userData
            })
            this.currentUser= ''
        }
    }
}
</script>

<style>
.login{
    padding: 5px;
}
.jonathan{
    height: 200px;
    width: 200px;
}
.login-button{
    padding: 15px 54px;
}

.user_div{
    padding: 15px 15px 2.5px 15px;
}

.pass_div{
    padding: 2.5px 15px 5px 15px;
}
</style>