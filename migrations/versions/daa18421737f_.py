"""empty message

Revision ID: daa18421737f
Revises: aa971a159ea5
Create Date: 2024-06-04 03:55:20.832172

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'daa18421737f'
down_revision = 'aa971a159ea5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('trolley', schema=None) as batch_op:
        batch_op.drop_constraint('trolley_course_id_fkey', type_='foreignkey')
        batch_op.drop_constraint('trolley_user_id_fkey', type_='foreignkey')
        batch_op.drop_column('user_id')
        batch_op.drop_column('course_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('trolley', schema=None) as batch_op:
        batch_op.add_column(sa.Column('course_id', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_foreign_key('trolley_user_id_fkey', 'user', ['user_id'], ['id'])
        batch_op.create_foreign_key('trolley_course_id_fkey', 'course', ['course_id'], ['id'])

    # ### end Alembic commands ###
