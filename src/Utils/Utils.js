let formattedDate = (date) => {
    try {
        let newDate = new Date(date);
        let mnth = ("0" + (newDate.getMonth() + 1)).slice(-2);
        let day = ("0" + newDate.getDate()).slice(-2);
        const fulldate = [day, mnth, newDate.getFullYear()].join(".");
        return fulldate;

    } catch (error) {
        console.log(error);
        return error;
    }
};

export default formattedDate;