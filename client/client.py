import requests
import string
import random

def getRandomText(char_num: int) -> str:
    return ''.join(random.choice(string.ascii_letters) for _ in range(char_num))

server_url = "http://localhost:3333/auth/signup"

def getRandomBody() -> dict:
    return {
        "email": getRandomText(random.randrange(5, 11)) + "@" + getRandomText(random.randrange(3, 6)) + ".com",
        "password": "123",
        "firstName": getRandomText(random.randrange(10, 15)),
        "lastName": getRandomText(random.randrange(10, 15))
    }


inp = int(input("Enter number of clients: "))

for i in range(inp):
    req = requests.post(server_url, data=getRandomBody())