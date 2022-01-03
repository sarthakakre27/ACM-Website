echo -e "\e[1;31m This will take a lot of time (20-30min, Will try to improve that in future) \e[0m"

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

sudo service docker start 
sudo chmod 777 ../../controllers/compiler/helpers/dockerRun.sh
sudo chmod 666 /var/run/docker.sock
sudo service docker restart
sudo groupadd docker
sudo usermod -aG docker $USER

echo "Creating Docker Image"
docker build -t 'compiler_image' - < smaller.Dockerfile
echo "Retrieving Installed Docker Images"
docker images


echo -e "\e[1;31m Please Logout and Login again \e[0m"
