import bcrypt

password = "123456789"

hash_password = bcrypt.hashpw(
    password.encode("utf-8"),
    bcrypt.gensalt()
)

print(hash_password.decode())