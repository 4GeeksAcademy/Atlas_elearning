"""empty message

Revision ID: 75baa9dcee00
Revises: 0c7136dd3bf8
Create Date: 2024-06-02 14:09:59.698251

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '75baa9dcee00'
down_revision = '0c7136dd3bf8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('payment', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id_paypal', sa.String(length=250), nullable=True))
        batch_op.add_column(sa.Column('status', sa.String(length=250), nullable=False))
        batch_op.add_column(sa.Column('currency_code', sa.String(length=250), nullable=False))
        batch_op.add_column(sa.Column('value', sa.String(length=250), nullable=False))
        batch_op.drop_column('title_course')
        batch_op.drop_column('pad_amount')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('payment', schema=None) as batch_op:
        batch_op.add_column(sa.Column('pad_amount', sa.VARCHAR(length=250), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('title_course', sa.VARCHAR(length=250), autoincrement=False, nullable=False))
        batch_op.drop_column('value')
        batch_op.drop_column('currency_code')
        batch_op.drop_column('status')
        batch_op.drop_column('id_paypal')

    # ### end Alembic commands ###
