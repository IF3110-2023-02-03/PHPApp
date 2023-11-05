# IF3110-2023-01-03
# Moments

> Disusun untuk memenuhi Tugas Milestone 1 - IF3110 Pengembangan Aplikasi Berbasis Web

## Daftar Isi

-   [Deskripsi Aplikasi _Web_](#deskripsi-aplikasi-web)
-   [Struktur Program](#struktur-program)
-   [Daftar _Requirement_](#daftar-requirement)
-   [Cara Instalasi](#cara-instalasi)
-   [Cara Menjalankan _Server_](#cara-menjalankan-server)
-   [Screenshot Tampilan Aplikasi](#screenshot-tampilan-aplikasi)
-   [Entity Relationship Diagram](#entity-relationship-diagram)
-   [Pembagian Tugas](#pembagian-tugas)

## Deskripsi Aplikasi _Web_

**Moments** Begitu banyak moment penting dalam hidup yang layak untuk diingat, entah moment bahagia, senang, ataupun sedih. Moments hadir untuk masalah tersebut. Dengan aplikasi berbasis web ini, Anda dapaet mengabadikan moment penting dalam hidup Anda dengan sangat mudah. Aplikasi ini dikembangkan menggunakan DBMS (MySQL) dan PHP murni beserta HTML, CSS, dan Javascript vanilla.


## Daftar _Requirement_

1. Login
2. Register
3. Home
4. Photos
5. Search
6. Feeds
7. Profil
8. Admin Dashboard
9. User Dashboard
10. User Management
11. Admin Detail
12. CRUD image, video

## Cara Instalasi

1. Lakukan pengunduhan _repository_ ini dengan menggunakan perintah `git clone https://github.com/natthankrish/IF3110-20230103.git` pada terminal komputer Anda.
2. Pastikan komputer Anda telah menginstalasi dan menjalankan aplikasi Docker.
3. Lakukan pembuatan _image_ Docker yang akan digunakan oleh aplikasi ini dengan menjalankan perintah `docker build -t tubes-1:latest .` pada terminal _directory_ aplikasi web.
4. Buatlah sebuah file `.env` yang bersesuaian dengan penggunaan (contoh file tersebut dapat dilihat pada `.env.example`).

## Cara Menjalankan _Server_

1. Anda dapat menjalankan program ini dengan menjalankan perintah `docker-compose up -d` pada terminal _directory_ aplikasi web.
2. Aplikasi web dapat diakses dengan menggunakan browser pada URL `http://localhost:8080/public/home`.
3. Aplikasi web dapat dihentikan dengan menjalankan perintah perintah `docker-compose down` pada terminal _directory_ aplikasi web.

## Screenshot Tampilan Aplikasi

### Login

![Login](https://github.com/natthankrish/IF3110-2023-01-03/assets/89324014/e061db4b-39c2-4740-9518-bdd58d99def9)

### Register

![Register](https://github.com/natthankrish/IF3110-2023-01-03/assets/89324014/a26da485-a074-4839-9ced-4c2a13bee684)

### Home

![Home](https://github.com/natthankrish/IF3110-2023-01-03/assets/89324014/1a903062-6089-4fa1-8106-c6a174eba6da)

### Photos

![Photos](https://github.com/IF3110-2023-02-03/PHPApp/assets/102899833/2a702972-1af1-4253-9325-3c0881b76205)

### Search

![Search](https://github.com/IF3110-2023-02-03/PHPApp/assets/102899833/a21dfe96-dd4f-43d4-b3c1-0c36647d6ef4)

### feeds

![Feeds](https://github.com/IF3110-2023-02-03/PHPApp/assets/102899833/e5894176-f8cb-4593-bf30-ce396612d5c6)

## _Entity Relationship Diagram_

![ERD](https://github.com/natthankrish/IF3110-2023-01-03/assets/89324014/a8013554-043c-4425-928e-7e67ecfd77c1)

## **Requirements**
Browser dan Docker

## BONUS
### Google Lighthouse
![Google Lighthouse](https://github.com/natthankrish/IF3110-2023-01-03/assets/92136335/69e287ff-40a4-4912-a36f-71739d262a57)

### Docker

## **Folder Structure**

```.
│   .env
│   .gitignore
│   compose.yml
│   Dockerfile
│   README.md
│
├───scripts
│
└───src
    ├───app
    │   │   .htaccess
    │   │   init.php
    │   │
    │   ├───components
    │   │   ├───admin
    │   │   │
    │   │   ├───home
    │   │   │
    │   │   ├───object
    │   │   │
    │   │   ├───user
    │   │
    │   ├───config
    │   │       config.php
    │   │
    │   ├───controllers
    │   │       AdminController.php
    │   │       CommentController.php
    │   │       HomeController.php
    │   │       likeController.php
    │   │       ObjectController.php
    │   │       PageNotFoundController.php
    │   │       UserController.php
    │   │
    │   ├───core
    │   │       App.php
    │   │       Controller.php
    │   │       Database.php
    │   │       StorageAccess.php
    │   │       Tables.php
    │   │
    │   ├───exceptions
    │   │       LoggedException.php
    │   │
    │   ├───interfaces
    │   │       ControllerInterface.php
    │   │       ViewInterface.php
    │   │
    │   ├───middlewares
    │   │       AuthenticationMiddleware.php
    │   │       TokenMiddleware.php
    │   │
    │   ├───models
    │   │       CommentModel.php
    │   │       LikeModel.php
    │   │       ObjectModel.php
    │   │       UserModel.php
    │   │
    │   └───views
    │       ├───admin
    │       │
    │       ├───home
    │       │
    │       └───user
    │
    ├───public
    │   │   .htaccess
    │   │   index.php
    │   │
    │   ├───assets
    │   │   ├───images
    │   │   │
    │   │   └───icon
    │   │
    │   ├───javascript
    │   │   ├───admin
    │   │   │
    │   │   ├───component
    │   │   │
    │   │   ├───lib
    │   │   │
    │   │   └───user
    │   │
    │   └───styles
    │       ├───admin
    │       │
    │       ├───home
    │       │
    │       ├───object
    │       │
    │       └───user
    │
    └───storage
        ├───images
        │       .gitkeep
        │
        └───songs
                .gitkeep
``````

## **Pembagian Kerja - Workload Breakdown**

**Anggota Kelompok**

| Nama                   | NIM      | Panggilan |
| ---------------------- | -------- | --------- |
| Mutawally Nawwar | 13521065 | Nawwar    |
| Ghazi Akmal Fauzan          | 13521058 | Ghazi  |
| Antonio Natthan Krishna     | 13521162 | Nate    |
| Ahmad Hapinuddin    | 10023079 | Hapid     |

**Server Side:**

| NIM                | Nama            | Fungsionalitas                                                                                                                                                  |
| ------------------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 13521065 | Nawwar | Database Design, API Development                                                                                                                            |
| 13521058          | Ghazi     | Architecture Design (Docker, Setup Folder Structuring, etc)                                                                                          |
| 13521058           | Ghazi       | Routing, AutoLoader, EnvLoader, Containers, Logging Middlewares                                                                      |
| 13521058           | Ghazi       | Handlers and AJAX for admin (User and Admin Table & Details)    |
| 13521162           | Nate          | Handlers and AJAX for user (Photos, Videos, Like, Comment) |
| 13521065 | Nawwar | Filtering and Paging Mechanism                                                                                                                                  |

**Client Side:**

| NIM                | Nama            | Fungsionalitas                                                                                                                                                                                                                                                  |
| ------------------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 13521162           | Nate          | UI Design, All Frontend Pages |
| 10023079          | Hapid          | HTML Register, Manage Account |
| 13521058           | Ghazi       | Admin Page Rendering |
| 13521065 | Nawwar | Search Page Rendering |


