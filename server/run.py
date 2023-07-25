import os

os.system('flask db init')
os.system('flask db migrate -m "create db tables"')
os.system('flask db upgrade')
os.system('python seed.py')