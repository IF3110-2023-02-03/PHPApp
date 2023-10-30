<!DOCTYPE html>
<html>
    <head>
        <title>Photos</title>
        <link rel="icon" href="<?= BASE_URL ?>/assets/icons/logo.png">
        <link rel="stylesheet" type="text/css" href="<?= BASE_URL ?>/styles/user/Photos.css">
        <link rel="stylesheet" type="text/css" href="<?= BASE_URL ?>/styles/user/Spaces.css">
        <link rel="stylesheet" type="text/css" href="<?= BASE_URL ?>/styles/object/Navbar.css">
        <link rel="stylesheet" type="text/css" href="<?= BASE_URL ?>/styles/object/Pagination.css">
        <!-- JavaScript Constant and Variables -->
        <script type="text/javascript" defer>
            const CSRF_TOKEN = "<?= $_SESSION['csrf_token'] ?? '' ?>";
            const DEBOUNCE_TIMEOUT = "<?= DEBOUNCE_TIMEOUT ?>";
            const BASE_URL = "<?= BASE_URL ?>";
            const STORAGE_URL = "<?= STORAGE_URL ?>";
        </script>

        <!-- JavaScript Library -->
        <script type="text/javascript" src="<?= BASE_URL ?>/javascript/lib/debounce.js" defer></script>

        <!-- JavaScript DOM and AJAX -->
        <script type="text/javascript" src="<?= BASE_URL ?>/javascript/user/spaces.js" defer></script>

        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <?php include(dirname(__DIR__) . '/object/UserNavbar.php') ?>
        <div class="content">
            <div class="item-settings-container">
                <h1 class="title">Spaces</h1>
                <form class="form">
                    <button class="back-button" id="back-button">Back</button>
                    <img id="button-search" src="<?= BASE_URL ?>/assets/icons/search.png"/>
                    <input type="text" id="searchbar" name="fname" class="textfield" placeholder="Search Creator"><br>    
                </form>
            </div>
            <div class="spaces-content" id="content">
            </div>
        </div>
        
    </body>
</html>