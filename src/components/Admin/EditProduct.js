import React, { useState, useEffect, useRef } from "react";
import Input from "../../UI/Input";
import classes from './Admin.module.scss';
import Modal from "../../UI/Modal";
import { getDetailsByKey, updateData } from "../../services/commonService";
import { formattedDate } from "../../Utils/Utils";
import { useToasts } from 'react-toast-notifications';

const EditProfile = props => {
    const { addToast } = useToasts();
    const [isLoader, setIsLoader] = useState(false);
    const [productDetail, setProductDetail] = useState({});

    const titleRef = useRef();
    const priceRef = useRef();
    const qtyRef = useRef();
    const avlRef = useRef();
    const colorRef = useRef();
    const offerRef = useRef();
    const spriceRef = useRef();
    const categoryRef = useRef();
    const detailRef = useRef();
    const sizeRef = useRef();

    useEffect(() => {
        fetchProductDetail();
    }, [0]);

    const fetchProductDetail = async () => {
        try {
            setIsLoader(true);
            const response = await getDetailsByKey('products', 'id', props.modalContent);
            setIsLoader(false);
            response[0].created_on = formattedDate(response[0].created_on);
            setProductDetail(response[0]);
        } catch (error) {
            console.log(error);
            setIsLoader(false);
        }
    }

    const updateProduct = async () => {
        const info = {
            tableName: "products",
            obj: {
                "title": titleRef.current.value,
                "price": priceRef.current.value,
                "quantity": qtyRef.current.value,
                "availiblity": avlRef.current.value,
                "color": colorRef.current.value,
                "offer": offerRef.current.value,
                "shipping_price": spriceRef.current.value,
                "category": categoryRef.current.value,
                "detail": detailRef.current.value,
                "size": sizeRef.current.value.toUpperCase()
            },
            key: "id",
            value: productDetail.id
        }
        try {
            setIsLoader(true);
            await updateData(info);
            setIsLoader(false);
            addToast("Successfully Updated", {
                appearance: 'success',
                autoDismiss: true,
                placement: "bottom-center"
            });

            setTimeout(() => {
                props.onClose();
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.log(error);
            setIsLoader(false);
            addToast("Sorry there is some error in updating it", {
                appearance: 'error',
                autoDismiss: true,
                placement: "bottom-center"
            });
        }
    }

    return (
        <Modal>
            {isLoader && <div className={classes.spinner}><i className="fa fa-spinner fa-pulse" aria-hidden="true" data-tip data-for="profileTip" /></div>}

            <h1>Edit {productDetail.title}</h1>
            <form className={classes.editProduct}>
                <Input
                    label="Title:"
                    input={{
                        type: "text",
                        defaultValue: productDetail.title,
                        ref: titleRef
                    }}
                />
                <div>
                    <label>Detail:</label>
                    <textarea value={productDetail.detail} ref={detailRef}></textarea>
                </div>
                <Input
                    label="Availiblity:"
                    input={{
                        type: "text",
                        defaultValue: productDetail.availiblity,
                        ref: avlRef
                    }}
                />
                <Input
                    label="Categories:"
                    input={{
                        type: "text",
                        defaultValue: productDetail.category,
                        ref: categoryRef
                    }}
                />
                <Input
                    label="Color:"
                    input={{
                        type: "text",
                        defaultValue: productDetail.color,
                        ref: colorRef
                    }}
                />
                <Input
                    label="Offer Available:"
                    input={{
                        type: "text",
                        defaultValue: productDetail.offer,
                        ref: offerRef
                    }}
                />
                <Input
                    label="Price:"
                    input={{
                        type: "number",
                        defaultValue: productDetail.price,
                        ref: priceRef
                    }}
                />
                <Input
                    label="Quantity:"
                    input={{
                        type: "number",
                        defaultValue: productDetail.quantity,
                        ref: qtyRef
                    }}
                />
                <Input
                    label="Shipping Price:"
                    input={{
                        type: "number",
                        defaultValue: productDetail.shipping_price,
                        ref: spriceRef
                    }}
                />
                <Input
                    label="Size Available:"
                    input={{
                        type: "text",
                        defaultValue: productDetail.size,
                        ref: sizeRef
                    }}
                />
                <Input
                    label="Created On:"
                    input={{
                        type: "text",
                        defaultValue: productDetail.created_on,
                        disabled: true
                    }}
                />
            </form>

            <div className={classes.modalBtns}>
                <button type="button" onClick={props.onClose}>Cancel</button>
                <button onClick={updateProduct}>Update</button>
            </div>
        </Modal>
    )
};

export default EditProfile;