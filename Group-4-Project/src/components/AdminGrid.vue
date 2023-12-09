<template>
    <table v-if="filteredData.length">
        <tr>
            <th v-for="key in columns">
                {{ capitalize(key) }}
            </th>
            <th>Delete</th>
        </tr>
        <tr v-for="entry in filteredData">
            <td v-for="key in columns">
                {{ entry[key] }}
            </td>
            <td @click="removeClass(entry['Subject'], entry['Class ID'])" class="delete"><button>X</button></td>
        </tr>
    </table>
    <p v-else>No classes found.</p>
</template>

<script>
export default {
    data() {
        return {
            columns: ['Subject', 'Class ID', 'Name', 'Number', 'Professor', 'Credits', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri']
        }
    },
    props:['data', 'filterKey'],
    computed: {
        filteredData() {
            const filterKey = this.filterKey && this.filterKey.toLowerCase()
            let data = this.data
            if (filterKey) {
                data = data.filter((row) => {
                    return Object.keys(row).some((key) => {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            return data
        }
    },
    methods: {
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        },
        async removeClass(Subject, ClassId) {
            
            this.$emit('removeClass', ClassId)  

            const data = {
                "Subject": Subject,
                "ClassId": ClassId
            }

            let response = await fetch("https://yhw30hsvu5.execute-api.us-east-1.amazonaws.com/classes/dynamodbmanager/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
        }
    }
}
</script>

<style>
table{
    border: 2px solid black;
    border-radius: 2px;
    background-color: #EEE;
    width: 30%;
}
th{
    background-color: #000E90;
    color: white;
    user-select: none;
}
th, td{
    min-width: 50px;
    padding: 10px 20px;
}
.delete{
    text-align: center;
}
</style>