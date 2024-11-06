/* METODOS DEL CRUD */

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";

/* 1. CREAR CONSTANTE PARA LA COLECCION */

const collectionString = "Usuarios";

/* 2. CREAR Y EXPORTAR TODOS LOS METODOS DEL CRUD */

export const onFindAll = async ()=> await getDocs(query(collection(db, collectionString)));

export const onFindById = async (Id)=> await getDoc(doc(db, collectionString, Id));

export const onInsert = async (documento)=> await addDoc(collection(db, collectionString), documento)

export const onUpdate = async (id, newDocument)=> await updateDoc(doc(db,collectionString, id), newDocument)

export const onDelete = async (id)=> await deleteDoc(doc(db, collectionString, id))     