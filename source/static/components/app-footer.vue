<template>
    <footer class="app-footer">
        <ul>
            <template v-if="hash">
                <li><span>^A</span> Select All</li>
                <li><span>^E</span> Edit New</li>
                <li><span>^D</span> Duplicate</li>
                <li><span>^R</span> Raw</li>
            </template>
            <template v-else>
                <li><span>^S</span> Save</li>
            </template>
        </ul>
    </footer>
</template>

<script>
    export default {
        props: {
            hash: {
                type: String,
                default: null
            }
        }
    };
</script>

<style scoped>
    .app-footer {
        padding: 1px 0;
        color: #c5c8c6;
    }

    ul {
        display: flex;
        padding: 0;
        margin: 0;
        list-style: none;
    }

    li {
        width: 120px;
    }

    span {
        color: #1d1f21;
        background-color: #c5c8c6;
    }

    li:first-child span {
        padding-left: 5px;
    }
</style>
