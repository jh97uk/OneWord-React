class OneLib{
    constructor(){
        this.showError = this.showError.bind();
    }
    static getRandomErrorTitle(){
        var titles = [
            'Uhoh, something went wrong...',
            'Snap...',
            'Oops...',
            'Houston, we have a problem...',
            'Send help...'
        ]
        return titles[Math.floor(Math.random() * titles.length)];
    }
    static showError(alert, error, onClose){
        alert.show(error.message, {
            title:this.getRandomErrorTitle(), 
            closeCopy:'Ok',
            onClose:onClose
        })
    }
}

export default OneLib;