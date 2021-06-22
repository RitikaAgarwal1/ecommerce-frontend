export const formattedDate = (date) => {
    let newDate = new Date(date);
    let mnth = ("0" + (newDate.getMonth() + 1)).slice(-2);
    let day = ("0" + newDate.getDate()).slice(-2);
    const fulldate = [day, mnth, newDate.getFullYear()].join(".");
    return fulldate;
};

export const titleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
};