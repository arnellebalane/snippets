<template>
    <footer class="app-footer">
        <ul>
            <template v-if="id">
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
    import pubsub from '../pubsub';

    export default {
        props: ['id'],

        methods: {
            save() {
                console.log('save');
            },

            selectAll() {
                pubsub.$emit('select-all');
            },

            editNew() {
                console.log('edit new');
            },

            duplicate() {
                console.log('duplicate');
            },

            raw() {
                console.log('raw');
            }
        },

        created() {
            const keybindings = {
                KeyA: this.selectAll,
                KeyD: this.duplicate,
                KeyE: this.editNew,
                KeyR: this.raw,
                KeyS: this.save
            };

            window.addEventListener('keydown', e => {
                if (e.ctrlKey && e.code in keybindings) {
                    e.preventDefault();
                    keybindings[e.code]();
                }
            });
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
