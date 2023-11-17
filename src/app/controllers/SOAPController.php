<?php

class SOAPController extends Controller implements ControllerInterface
{
    public function index()
    {
        try {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                    $notFoundView = $this->view('home', 'PageNotFoundView');
                    $notFoundView->render();
                    exit;

                default:
                    throw new LoggedException('Method Not Allowed', 405);
            }
        } catch (Exception $e) {
            http_response_code($e->getCode());
            exit;
        }
    }

    public function reqFollow()
    {
        try {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    $creatorID = $_POST['creatorID'];
                    $followerID = $_POST['followerID'];
                    $creatorName = $_POST['creatorName'];
                    $followerName = $_POST['followerName'];
                    $creatorUsername = $_POST['creatorUsername'];
                    $followerUsername = $_POST['followerUsername'];
                    $ch = curl_init('http://host.docker.internal:8000/api/following');
                    
                    $xmlData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">
                    <Body>
                        <requestFollow xmlns=\"http://services.example.org/\">
                            <arg0 xmlns=\"\">$creatorID</arg0>
                            <arg1 xmlns=\"\">$followerID</arg1>
                            <arg2 xmlns=\"\">$creatorName</arg2>
                            <arg3 xmlns=\"\">$followerName</arg3>
                            <arg4 xmlns=\"\">$creatorUsername</arg4>
                            <arg5 xmlns=\"\">$followerUsername</arg5>
                            <arg6 xmlns=\"\">ini_api_key_monolitik</arg6>
                        </requestFollow>
                    </Body>
                </Envelope>";

                    echo $xmlData;

                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $xmlData);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                        'Content-Type: text/xml', // Set appropriate content-type for XML
                        'Content-Length: ' . strlen($xmlData) // Ensure proper length is set
                    ));

                    $response = curl_exec($ch);
                    // Check for errors
                    if (curl_errno($ch)) {
                        echo 'Request Error:' . curl_error($ch);
                    }

                    echo $response;

                default:
                    throw new LoggedException('Method Not Allowed', 405);
            }
        } catch (Exception $e) {
            http_response_code($e->getCode());
            exit;
        }
    }

    public function getContentCreators()
    {
        try {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                    $page = $_GET['page'];
                    $filter = $_GET['filter'];
                    $id = $_GET['id'];

                    $ch = curl_init('http://host.docker.internal:8000/api/following');
                    
                    $xmlData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">
                        <Body>
                            <getContentCreators xmlns=\"http://services.example.org/\">
                                <arg0 xmlns=\"\">$page</arg0>
                                <arg1 xmlns=\"\">12</arg1>
                                <arg2 xmlns=\"\">$filter</arg2>
                                <arg3 xmlns=\"\">$id</arg3>
                                <arg4 xmlns=\"\">ini_api_key_monolitik</arg4>
                            </getContentCreators>
                        </Body>
                    </Envelope>";

                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $xmlData);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                        'Content-Type: text/xml', // Set appropriate content-type for XML
                        'Content-Length: ' . strlen($xmlData) // Ensure proper length is set
                    ));

                    $response = curl_exec($ch);
                    // Check for errors
                    if (curl_errno($ch)) {
                        echo 'Request Error:' . curl_error($ch);
                    }

                    header("Content-type: text/xml");

                    echo $response;

                default:
                    throw new LoggedException('Method Not Allowed', 405);
            }
        } catch (Exception $e) {
            http_response_code($e->getCode());
            exit;
        }
    }

    public function getContents()
    {
        try {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                    $page = $_GET['page'];
                    $id = $_GET['id'];

                    $ch = curl_init('http://host.docker.internal:8000/api/following');
                    
                    $xmlData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">
                            <Body>
                                <getContent xmlns=\"http://services.example.org/\">
                                    <arg0 xmlns=\"\">$id</arg0>
                                    <arg1 xmlns=\"\">$page</arg1>
                                    <arg2 xmlns=\"\">5</arg2>
                                    <arg3 xmlns=\"\">ini_api_key_monolitik</arg3>
                                </getContent>
                            </Body>
                        </Envelope>";

                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $xmlData);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                        'Content-Type: text/xml', // Set appropriate content-type for XML
                        'Content-Length: ' . strlen($xmlData) // Ensure proper length is set
                    ));

                    $response = curl_exec($ch);
                    // Check for errors
                    if (curl_errno($ch)) {
                        echo 'Request Error:' . curl_error($ch);
                    }

                    header("Content-type: text/xml");

                    echo $response;

                default:
                    throw new LoggedException('Method Not Allowed', 405);
            }
        } catch (Exception $e) {
            http_response_code($e->getCode());
            exit;
        }
    }
}