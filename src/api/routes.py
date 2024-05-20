"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Manager, Teacher, Course, Orders, Payment, Modules, Request 
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import check_password_hash

from flask_bcrypt import bcrypt, generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, decode_token
from datetime import timedelta

from flask_mail import Message
from app import mail


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/signup/user', methods=['POST'])
def create_signup_user():
    try:
        #Obtenermos los datos de los campos del body
        email =  request.json.get('email')
        password = request.json.get('password')
        is_user = request.json.get('isUser')
        name = request.json.get('name') 
        last_name = request.json.get('lastName')
        username = request.json.get('username')
        number_document = request.json.get('numberDocument')
        phone = request.json.get('phone')
        age = request.json.get('age')
        gender = request.json.get('gender')
        
        #Verificacion de campos vacios
        if not email or not password or not is_user or not name or not last_name or not username or not number_document or not phone or not age or not gender:
            return({"Error":"Email, password, is_user, name, last_name, username, number_document, phone, age and gender are required"}), 400
        
        #Verificacion de existencia de email en la base de datos
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"Error":"Email already exists."}), 409
        
        #Password encriptada
        password_hash = generate_password_hash(password)

        #User con password encriptada
        new_user = User(
            email=email,
            password=password_hash,
            is_user=is_user,
            name=name,
            last_name=last_name,
            username=username,
            number_document=number_document,
            phone=phone,
            age=age,
            gender=gender
        )
        db.session.add(new_user)
        db.session.commit()

        # Enviar correo de bienvenida
        msg = Message('Welcome to Our Platform', recipients=[email])
        msg.body = f"Hello {name},\n\nThank you for signing up on our platform. We're excited to have you on board!"
        mail.send(msg)

        return jsonify({"Message":"User Created Successfully", "user_create": new_user.serialize()}), 201

    except Exception as err:
        return jsonify({"Error":"Error in User Creation:" + str(err)}), 500

@api.route('/signup/teacher', methods=['POST'])
def create_signup_teacher():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        is_teacher = request.json.get('isTeacher')
        name = request.json.get('name')
        last_name = request.json.get('lastName')
        username = request.json.get('username')
        number_document = request.json.get('numberDocument')
        phone = request.json.get('phone')
        age = request.json.get('age')
        gender = request.json.get('gender')
        certificate_teacher = request.json.get('certificateTeacher')
        user_id = request.json.get('userId')

    
        # Check if any required field is None or empty
        if email is None or password is None or is_teacher is None or name is None or last_name is None or username is None or number_document is None or phone is None or age is None or gender is None:
            return jsonify({"Error": "email, password, is_teacher, name, last_name, username, number_document, phone, age, gender, certificate_teacher, user_id are required"}), 400
        
        existing_teacher = Teacher.query.filter_by(email=email).first()
        if existing_teacher:
            return jsonify({"Error": "Email already exists"}), 409
        
        password_hash = generate_password_hash(password)

        new_teacher = Teacher(
            email=email,
            password=password_hash,
            is_teacher=is_teacher,
            name=name,
            last_name=last_name,
            username=username,
            number_document=number_document,
            phone=phone,
            age=age,
            gender=gender,
            certificate_teacher=certificate_teacher,
            user_id=user_id
        )
        db.session.add(new_teacher)
        db.session.commit()

        # Enviar correo de bienvenida
        msg = Message('Welcome to Our Platform, TEACHER', recipients=[email])
        msg.body = f"Hello {name},\n\nThank you for signing up on our platform. We're excited to have you on board!"
        mail.send(msg)

        return jsonify({"Message": "Teacher Created Successfully", "teacher_create": new_teacher.serialize()}), 201
    except Exception as e:
        return jsonify({"error": "Error posting teacher user" + str(e)})

@api.route('/signup/manager', methods=['POST'])
def create_signup_manager():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        is_manager = request.json.get('isManager')  
        name = request.json.get('name')
        last_name = request.json.get('lastName')  
        phone = request.json.get('phone')
        user_id = request.json.get('userId')  
        teacher_id = request.json.get('teacherId')  

        # Validar la longitud del correo electrónico
        if len(email) > 80:
            return jsonify({"Error": "Email too long"}), 400

        if not email or not password or not is_manager or not name or not last_name or not phone:
            return jsonify({"msg": "email, password, is_manager, name, last_name, phone, user_id and teacher_id are required"})
        
        existing_manager = Manager.query.filter_by(email=email).first()
        if existing_manager:
            return jsonify({"msg": "Email already exists"}), 409
        
        password_hash = generate_password_hash(password)

        new_manager = Manager(
            email=email,
            password=password_hash,
            is_manager=is_manager,
            name=name,
            last_name=last_name,
            phone=phone,
            user_id=user_id,
            teacher_id=teacher_id
        )
        db.session.add(new_manager)
        db.session.commit()

        # Enviar correo de bienvenida
        msg = Message('Welcome to Our Platform, MANAGER', recipients=[email])
        msg.body = f"Hello {name},\n\nThank you for signing up on our platform. We're excited to have you on board!"
        mail.send(msg)
        
        return jsonify({"msg": "manager has been created successfully", "manager_create": new_manager.serialize()}), 201
    except Exception as e: 
        return jsonify({"Error": "Error in user manager creation" + str(e)}), 500




@api.route('/login/user', methods=['POST'])
def get_token_login_user():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        if not email or not password:
            return jsonify({"Error": "Email and Password are required"}), 400
        
        # Buscar el usuario con ese correo
        login_user = User.query.filter_by(email=email).first()
        if not login_user:
            return jsonify({'Error': 'Invalid Email'}), 400

        # Obtener la contraseña desde la base de datos
        password_from_db = login_user.password

        # Verificar la contraseña
        true_or_false = check_password_hash(password_from_db, password)

        if true_or_false:
            expires = timedelta(days=1)
            user_id = login_user.id
            access_token = create_access_token(identity=user_id, expires_delta=expires)
            return jsonify({"access_token": access_token}), 200
        else:
            return jsonify({"Error":"Invalid Password"}), 400
        
    except Exception as e:
        return jsonify({"Error": "User not exists in Data Base", "Msg": str(e)}), 500


@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    email = request.json.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    reset_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))
    reset_link = url_for('api.reset_password', token=reset_token, _external=True)

    msg = Message('Password Reset Request', recipients=[email])
    msg.body = f"To reset your password, click the following link: {reset_link}"
    mail.send(msg)

    return jsonify({"message": "Password reset link sent"}), 200

# Ruta para resetear la contraseña
@api.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    try:
        decoded_token = decode_token(token)
        user_id = decoded_token['sub']
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "Invalid or expired token"}), 400

        new_password = request.json.get('password')
        if not new_password:
            return jsonify({"error": "Password is required"}), 400

        user.password = generate_password_hash(new_password).decode('utf-8')
        db.session.commit()
        return jsonify({"message": "Password reset successful"}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500




@api.route('/login/manager', methods=['POST'])
def get_token_login_manager():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        if not email or not password:
            return jsonify({"Error": "Email and Password are required"}), 400

        #buscamos el user con ese correo
        login_manager = Manager.query.filter_by(email=request.json['email']).one()

        if not login_manager:
            return jsonify({'Error': 'Invalid Email'}), 400

        password_from_db = login_manager.password
        hashed_password_hex = password_from_db
        hashed_password_bin = bytes.fromhex(hashed_password_hex[2:])
        true_or_false = check_password_hash(hashed_password_bin, password)

        if true_or_false:
            expires = timedelta(days=1)
            user_id = login_manager.id
            access_token = create_access_token(identity=user_id, expires_delta=expires)
            return jsonify({"access_token": access_token}), 200
        else:
            return {"Error":"Invalid Password"}, 400
    except Exception as e:
        return jsonify({"Error": "Manager not exists in Data Base" , "Msg": str(e)}), 500

@api.route('/login/teacher', methods=['POST'])
def get_token_login_teacher():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        if not email or not password:
            return jsonify({"Error": "Email and Password are required"}), 400

        #buscamos el user con ese correo
        login_teacher = Teacher.query.filter_by(email=request.json['email']).one()

        if not login_teacher:
            return jsonify({'Error': 'Invalid Email'}), 400

        password_from_db = login_teacher.password
        hashed_password_hex = password_from_db
        hashed_password_bin = bytes.fromhex(hashed_password_hex[2:])
        true_or_false = check_password_hash(hashed_password_bin, password)

        if true_or_false:
            expires = timedelta(days=1)
            user_id = login_teacher.id
            access_token = create_access_token(identity=user_id, expires_delta=expires)
            return jsonify({"access_token": access_token}), 200
        else:
            return jsonify({"Error":"Invalid Password"}), 400
    except Exception as e:
        return jsonify({"Error": "Teacher not exists in Data Base" , "Msg": str(e)}), 500


@api.route('/view/user')
@jwt_required() #Decorador para requerir autenticacion con jwt
def show_view_user():
    current_token = get_jwt_identity() #obtiene la id del user del token
    if current_token:
        
        users = User.query.all()
        user_list = []
        for user in users:
            user_dict = {
                "id": user.id,
                "email": user.email,
                "isUser": user.is_user,
                "name": user.name,
                "lastName": user.last_name,
                "username": user.username,
                "numberDocument": user.number_document,
                "phone": user.phone,
                "age": user.age,
                "gender": user.gender
            }
            user_list.append(user_dict)


        return jsonify({"access_to_user": user_list}), 200
        
    else:
        return jsonify({"Error": "Token invalid or not exits"}), 401

@api.route('/view/teacher')
@jwt_required() #Decorador para requerir autenticacion con jwt
def show_view_teacher():
    current_token = get_jwt_identity() #obtiene la id del user del token
    if current_token:
        
        users = User.query.all()
        user_list = []
        for user in users:
            user_dict = {
                "id": user.id,
                "email": user.email,
                "isUser": user.is_user,
                "name": user.name,
                "lastName": user.last_name,
                "username": user.username,
                "numberDocument": user.number_document,
                "phone": user.phone,
                "age": user.age,
                "gender": user.gender
            }
            user_list.append(user_dict)

        teachers = Teacher.query.all()
        teacher_list = []
        for teacher in teachers:
            teacher_dict = {
                "id": teacher.id,
                "email": teacher.email,
                "is_teacher": teacher.is_teacher,
                "name": teacher.name,
                "lastName": teacher.last_name,
                "username": teacher.username,
                "numberDocument": teacher.number_document,
                "phone": teacher.phone,
                "age": teacher.age,
                "gender": teacher.gender,
                "certificateTeacher": teacher.certificate_teacher,
                "userId": teacher.user_id
            }
            teacher_list.append(teacher_dict)

        return jsonify({"access_to_user": user_list, "access_to_teacher": teacher_list}), 200
        
    else:
        return jsonify({"Error": "Token invalid or not exits"}), 401

@api.route('/view/manager')
@jwt_required() #Decorador para requerir autenticacion con jwt
def show_view_manager():
    current_token = get_jwt_identity() #obtiene la id del user del token
    if current_token:
        
        users = User.query.all()
        user_list = []
        for user in users:
            user_dict = {
                "id": user.id,
                "email": user.email,
                "isUser": user.is_user,
                "name": user.name,
                "lastName": user.last_name,
                "username": user.username,
                "numberDocument": user.number_document,
                "phone": user.phone,
                "age": user.age,
                "gender": user.gender
            }
            user_list.append(user_dict)

        teachers = Teacher.query.all()
        teacher_list = []
        for teacher in teachers:
            teacher_dict = {
                "id": teacher.id,
                "email": teacher.email,
                "is_teacher": teacher.is_teacher,
                "name": teacher.name,
                "lastName": teacher.last_name,
                "username": teacher.username,
                "numberDocument": teacher.number_document,
                "phone": teacher.phone,
                "age": teacher.age,
                "gender": teacher.gender,
                "certificateTeacher": teacher.certificate_teacher,
                "userId": teacher.user_id
            }
            teacher_list.append(teacher_dict)

        managers = Manager.query.all()
        manager_list = []
        for manager in managers:
            manager_dict = {
                "id": manager.id,
                "email": manager.email,
                "isManager": manager.is_manager,
                "name": manager.name,
                "lastName": manager.last_name,
                "phone": manager.phone,
                "userId": manager.user_id,
                "teacherId": manager.teacher_id
            }
            manager_list.append(manager_dict)

        return jsonify({"access_to_user": user_list, "access_to_teacher": teacher_list, "access_to_manager": manager_list}), 200
        
    else:
        return jsonify({"Error": "Token invalid or not exits"}), 401


@api.route('/view/courses', methods=['POST'])
def post_courses():
    try:
        
        title =  request.json.get('title')
        category_title = request.json.get('categoryTitle')
        modules_length = request.json.get('modulesLength')
        certificate = request.json.get('certificate') 

        #Verificacion de campos vacios
        if not title or not category_title or not modules_length or not certificate :
            return({"Error":"title, category_title, modules_length and certificate  are required"}), 400
        
        #Verificacion de existencia de titulo en la base de datos
        existing_course = Course.query.filter_by(title=title).first()
        if existing_course:
            return jsonify({"Error":"Title already exists."}), 409
        
        
        course = Course(title=title, category_title=category_title, modules_length=modules_length, certificate=certificate)
        db.session.add(course)
        db.session.commit()
        return jsonify({"Msg":"Course create", "Course":course.serialize()}), 200

    except Exception as err:
        return jsonify({"Error":"Error in Course Creation:" + str(err)}), 500


@api.route('/view/courses', methods=['GET'])
def get_courses():
    try:
        courses = Course.query.all()
        serialized_courses = [course.serialize() for course in courses]
        return jsonify({"Courses": serialized_courses}), 200
    
    except Exception as err:
        return jsonify({"Error": "Error in fetching courses: " + str(err)}), 500


@api.route('/view/courses/<int:course_id>', methods=['PUT'])
def put_courses(course_id):
    try:
        course = Course.query.get(course_id)
        if not course:
            return jsonify({"Error": "Course not found"}),404
        
        updated_data = request.json
        for key, value in updated_data.items():
            setattr(course, key, value)
        db.session.commit()
        return jsonify({"Msg": "Course updated successfully.", "Course": course.serialize()}), 200
    
    except Exception as err:
        return jsonify({"Error": "Error in updating course: " + str(err)}), 500


@api.route('/view/courses/<int:course_id>', methods=['DELETE'])
def delete_courses(course_id):
    try:
        course = Course.query.get(course_id)

        if not course:
            return jsonify({"Error": "Course not found"}), 404
        
        db.session.delete(course)
        db.session.commit()
        return jsonify({"Msg": "Course delete succesfully."}), 200
    
    except Exception as err:
        return jsonify({"Error": "Error in deleting course: " + str(err)}), 500

@api.route('/module/course', methods=['POST'])
def post_module():
    try:
        course_id = request.json.get('courseId')  
        type_file = request.json.get('typeFile')
        title = request.json.get('title')
        video_id = request.json.get('videoId')
        type_video = request.json.get('typeVideo')
        text_id = request.json.get('textId')
        type_text = request.json.get('typeText')
        image_id = request.json.get('imageId')
        type_image = request.json.get('typeImage')

        if not course_id or not type_file or not title or not video_id or not type_video or not text_id or not type_text or not image_id or not type_image:
            return {"Error": "courseId, typeFile, title, videoId, typeVideo, textId, typeText, imageId, and typeImage are required"}, 400

        
        existing_course = Course.query.filter_by(id=course_id).first()
        if not existing_course:
            return jsonify({"Error": "Course does not exist."}), 404

        module = Modules(course_id=course_id, type_file=type_file, title=title, video_id=video_id, type_video=type_video,
                         text_id=text_id, type_text=type_text, image_id=image_id, type_image=type_image)
        db.session.add(module)
        db.session.commit()
        return jsonify({"Msg": "Module created successfully", "Module": module.serialize()}), 201

    except Exception as err:
        return jsonify({"Error": "Error in module Creation: " + str(err)}), 500


@api.route('/module/course/', methods=['GET'])
def get_modules():
    try:
        modules = Modules.query.all()
        if not modules:
            return jsonify({"Msg": "No modules found"}), 404
        
        serialized_modules = [module.serialize() for module in modules]
        return jsonify({"Modules": serialized_modules}), 200
    
    except Exception as err:
        return jsonify({"Error": "Error in fetching modules: " + str(err)})

@api.route('/module/course/<int:module_id>', methods=['DELETE'])
def delete_module(module_id):
    try:
        module = Modules.query.get(module_id)
        if not module:
            return jsonify({"Error": "Module does no exist"}), 404
        
        db.session.delete(module)
        db.session.commit()

        return jsonify({"Msg": "Module deleted successfully"}), 200
    
    except Exception as err:
        return jsonify({"Error": "Error in module deletion: " + str(err)}), 500