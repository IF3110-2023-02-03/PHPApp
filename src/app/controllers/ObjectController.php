<?php

class ObjectController extends Controller implements ControllerInterface
{
    public function index()
    {
        
    }
    public function storeImage()
    {
        try {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    $storageAccess = new StorageAccess(StorageAccess::IMAGE_PATH);
                    $uploadedImage = $storageAccess->saveImage($_FILES['image']['tmp_name']);

                    $objectModel = $this->model('ObjectModel');
                    $objectModel->store($_POST['user_id'], $_POST['title'], $uploadedImage, NULL, $_POST['date'],  $_POST['location'], 'Photo');
                    exit;

                default:
                    throw new LoggedException('Method Not Allowed', 405);
            }
        } catch (Exception $e) {
            http_response_code($e->getCode());
            exit;
        }
    }

    public function storeVideo()
    {
        try {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    $storageAccess = new StorageAccess(StorageAccess::IMAGE_PATH);
                    $uploadedImage = $storageAccess->saveImage($_FILES['image']['tmp_name']);
                    $uploadVideo = $storageAccess->saveVideo($_POST['video']['tmp_name']);
                    
                    $objectModel = $this->model('ObjectModel');
                    $objectModel->store($_POST['user_id'], $_POST['title'], $uploadedImage, $uploadVideo, $_POST['date'],  $_POST['location'], 'Photo');
                    exit;

                default:
                    throw new LoggedException('Method Not Allowed', 405);
            }
        } catch (Exception $e) {
            http_response_code($e->getCode());
            exit;
        }
    }

    public function delete()
    {
        try {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    $objectModel = $this->model('ObjectModel');
                    $objectModel->delete($_POST['user_id'],$_POST['object_id']);
                    exit;
                default:
                    throw new LoggedException('Method Not Allowed', 405);
            }
        } catch (Exception $e) {
            http_response_code($e->getCode());
            exit;
        }
    }
}