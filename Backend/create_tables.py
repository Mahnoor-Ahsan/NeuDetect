from app.database import Base, engine
from app.models.analysis import Analysis
from app.models.user import User


print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("Database tables created successfully.")