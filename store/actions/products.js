import Product from '../../models/product';
import FireStoreParser from 'firestore-parser';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = 'test';
    try {
      const resp = await fetch(
        'https://firestore.googleapis.com/v1/projects/rn-test-project-d3508/databases/(default)/documents/products/1'
      );
      if (!resp.ok) {
        throw new Error('Something went wrong!');
      }
      const resData  = await resp.json();
      const { fields } = await FireStoreParser(resData);
      const loadedProducts = [];
        loadedProducts.push(
          new Product(
            '1',
            fields.ownerId,
            fields.title, 
            'test', 
            fields.desc, 
            fields.price 
          )
        );   
      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteProduct = id => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const resp = await fetch(
        `https://react-native-app-c6b14.firebaseio.com/products/${id}.json?auth=${token}`,
        {
          method: 'DELETE'
        }
      );
      if (!resp.ok) {
        throw new Error('Oops something went wrong');
      }
      dispatch({ type: DELETE_PRODUCT, pid: id });
    } catch (err) {
      throw err;
    }
  };
};

export const createProduct = (title, desc, imgUrl, price) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    try {
      const resp = await fetch(
        `https://firestore.googleapis.com/v1/projects/rn-test-project-d3508/databases/(default)/documents/products/1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            desc,
            imgUrl,
            price,
            ownerId: userId
          })
        }
      );

      const resData = await resp.json();
      console.log(resData);
      
      dispatch({
        type: CREATE_PRODUCT,
        productData: {
          id: resData.name,
          title,
          desc,
          imgUrl,
          price,
          ownerId: userId
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const updateProduct = (id, title, desc, imgUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const resp = await fetch(
        `https://firestore.googleapis.com/v1/projects/rn-test-project-d3508/databases/(default)/documents/products/1`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            desc,
            imgUrl
          })
        }
      );
      console.log(resp);
      
      if (!resp.ok) {
        throw new Error('Oops something went wrong');
      }
      dispatch({
        type: UPDATE_PRODUCT,
        pid: id,
        productData: {
          title,
          desc,
          imgUrl
        }
      });
    } catch (err) {
      throw err;
    }
  };
};
