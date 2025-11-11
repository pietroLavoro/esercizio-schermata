#Programma per consultare i numeri primi fino 1000

numeri_primi = []
for num in range(2, 1001):
    is_primo = True
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            is_primo = False
            break
    if is_primo:
        numeri_primi.append(num)
