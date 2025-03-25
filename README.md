# IndexDB Manager  

![npm](https://img.shields.io/npm/v/indexdb-manager)  
![License](https://img.shields.io/npm/l/indexdb-manager)  
![Downloads](https://img.shields.io/npm/dm/indexdb-manager)  
![CI Status](https://img.shields.io/github/actions/workflow/status/tu-usuario/indexdb-manager/ci.yml)  
![Demo](https://img.shields.io/badge/demo-online-green)  

**IndexDB Manager** es un potente envoltorio TypeScript para IndexedDB que simplifica la gestión de bases de datos, tablas y columnas con operaciones CRUD completas.  

## Características  

- 🛠️ Creación de bases de datos, tablas y columnas  
- 🔍 Operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar)  
- 🔎 Consultas avanzadas con filtrado, ordenación y paginación  
- 🛡️ Operaciones type-safe con soporte TypeScript  
- 🔄 Soporte para transacciones  
- 📊 Gestión de índices  
- 🚀 Ligero y fácil de usar  
- 🏗️ Migraciones de esquema  
- 🔌 Agnóstico a frameworks (funciona con React, Angular, Vue, etc.)  

## Instalación  

```bash  
npm install indexdb-manager  
# o  
yarn add indexdb-manager  
```  

## Uso Básico  

### 1. Creación de una Base de Datos  

```typescript  
import { Database, Table, Column } from 'indexdb-manager';  

const myDB = new Database({  
  name: 'MyAppDB',  
  version: 1,  
  tables: [  
    {  
      name: 'users',  
      primaryKey: 'id',  
      autoIncrement: true,  
      columns: [  
        { name: 'name', type: 'string', required: true },  
        { name: 'email', type: 'string', unique: true },  
        { name: 'age', type: 'number' },  
        { name: 'isActive', type: 'boolean', defaultValue: true }  
      ]  
    }  
  ]  
});  

const db = await myDB.connect();  
```  

## Integración con Frameworks  

### Ejemplo con React  

```jsx  
import { useEffect, useState } from 'react';  
import { Database } from 'indexdb-manager';  

function UserList() {  
  const [users, setUsers] = useState([]);  

  useEffect(() => {  
    async function loadData() {  
      const db = new Database({ /* config */ });  
      const connection = await db.connect();  
      const users = await db.getTable('users').findAll(connection);  
      setUsers(users);  
    }  

    loadData();  
  }, []);  

  return (  
    <ul>  
      {users.map(user => (  
        <li key={user.id}>{user.name}</li>  
      ))}  
    </ul>  
  );  
}  
```  

### Ejemplo con Angular  

```typescript  
import { Injectable } from '@angular/core';  
import { Database } from 'indexdb-manager';  

@Injectable({ providedIn: 'root' })  
export class DataService {  
  private db: Database;  

  constructor() {  
    this.db = new Database({ /* config */ });  
  }  

  async getUsers() {  
    const connection = await this.db.connect();  
    return this.db.getTable('users').findAll(connection);  
  }  
}  
```  

### Ejemplo con Vue  

```vue  
<script setup>  
import { ref, onMounted } from 'vue';  
import { Database } from 'indexdb-manager';  

const users = ref([]);  

onMounted(async () => {  
  const db = new Database({ /* config */ });  
  const connection = await db.connect();  
  users.value = await db.getTable('users').findAll(connection);  
});  
</script>  
```  

## Uso Avanzado  

### Consultas de Datos  

```typescript  
// Buscar usuarios activos mayores de 21 años, ordenados por nombre  
const activeUsers = await usersTable.findAll(db, {  
  where: {  
    isActive: { equals: true },  
    age: { greaterThan: 21 }  
  },  
  orderBy: { name: 'asc' }  
});  
```  

### Transacciones  

```typescript  
const transaction = db.transaction(['users', 'orders'], 'readwrite');  

try {  
  await usersTable.createInTransaction(transaction, userData);  
  await ordersTable.createInTransaction(transaction, orderData);  
  await transaction.complete;  
} catch (error) {  
  transaction.abort();  
}  
```  

## Registro de Cambios  

### v1.1.0  
- Soporte para transacciones  
- Mejoras en las definiciones TypeScript  
- Nuevos operadores de consulta  

### v1.0.0  
- Versión inicial con operaciones CRUD básicas  

## Guía de Migración  

```typescript  
// Actualizar versión de la base de datos para modificar el esquema  
const myDB = new Database({  
  name: 'MyAppDB',  
  version: 2, // Versión incrementada  
  tables: [  
    // Esquema actualizado  
  ]  
});  
```  

## Soporte de Navegadores  

- Chrome 24+  
- Firefox 16+  
- Safari 7.1+  
- Edge 12+  
- Opera 15+  

## Demo en Vivo  

[Pruébalo online](https://demo.indexdb-manager.com)  

## Contribuciones  

1. Haz un fork del repositorio  
2. Crea tu rama de feature  
3. Haz commit de tus cambios  
4. Haz push a la rama  
5. Abre un Pull Request  

```bash  
git clone https://github.com/tu-usuario/indexdb-manager.git  
cd indexdb-manager  
npm install  
npm run dev  
```  

## Licencia  

MIT © 2023 Alberto Godoy  

## Soporte  

- [Issues en GitHub](https://github.com/albertogodoy/indexdb-manager/issues)  
- soporte@indexdb-manager.com