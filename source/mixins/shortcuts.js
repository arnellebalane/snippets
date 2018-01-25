export default {
    methods: {
        getShortcuts() {
            return {};
        }
    },

    created() {
        const shortcuts = this.getShortcuts();

        window.addEventListener('keydown', e => {
            if (e.ctrlKey && e.code in shortcuts) {
                e.preventDefault();
                shortcuts[e.code]();
            }
        });
    }
};
