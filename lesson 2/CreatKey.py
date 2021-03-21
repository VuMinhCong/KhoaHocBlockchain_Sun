import secrets, codecs, hashlib, ecdsa, base58
# create private key
def generate_private_key():

    bits = secrets.randbits(256)
    bits_hex = hex(bits)
    private_key = bits_hex[2:]

    return private_key

# create public key
def generate_public_key(private_key):

    sk = ecdsa.SigningKey.from_string(codecs.decode(private_key, 'hex'), curve=ecdsa.SECP256k1)
    vk = sk.verifying_key
    # 04: uncompressed
    public_key = '04' + vk.to_string().hex()

    return public_key

def generate_address(public_key):

    ##  ENCRYPTED THE PUBLIC KEY: public key = RIPEMD-160(SHA-256(public key))

    public_key_bytes = codecs.decode(public_key, 'hex')
    # Run SHA-256 for the public key
    sha256_bpk = hashlib.sha256(public_key_bytes)
    sha256_bpk_digest = sha256_bpk.digest()
    # Run RIPEMD-160 for the SHA-256
    ripemd160_bpk = hashlib.new('ripemd160')
    ripemd160_bpk.update(sha256_bpk_digest)
    ripemd160_bpk_digest = ripemd160_bpk.digest()
    ripemd160_bpk_hex = ripemd160_bpk_digest.hex()


    ## CHECKSUM

    encrypted_public_key_bytes = codecs.decode(encrypted_public_key, 'hex')
    sha256_nbpk = hashlib.sha256(encrypted_public_key_bytes)
    sha256_nbpk_digest = sha256_nbpk.digest()
    sha256_2_nbpk = hashlib.sha256(sha256_nbpk_digest)
    sha256_2_nbpk_digest = sha256_2_nbpk.digest()
    sha256_2_hex = sha256_2_nbpk_digest.hex()
    checksum = sha256_2_hex[:8]

    ## CREATE HEX ADDRESS
    hex_address = encrypted_public_key + checksum

    ## CONVERT HEX ADDRESS TO BASE58 ADDRESS
    bitcoin_address_bytes = base58.b58encode(bytes.fromhex(hex_address))
    bitcoin_address = codecs.decode(bitcoin_address_bytes, 'utf-8')

    return bitcoin_address

if __name__ == '__main__':
    private_key = generate_private_key()
    public_key = generate_public_key(private_key)
    address = generate_address(public_key)

    print("Private key: ", private_key)
    print("Public key: ", public_key)
    print("Address: ", address)